provider "aws" {
  region = var.region
}


module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.13.0"

  cluster_name    = local.cluster_name
  cluster_version = "1.32"
  vpc_id          = var.vpc_id
  subnet_ids      = var.private_subnet_ids

  enable_irsa = true

  cluster_endpoint_public_access       = true
  cluster_endpoint_private_access      = true
  cluster_endpoint_public_access_cidrs = local.personal_cidr_blocks

  fargate_profiles = {
    default = {
      name = "${var.custom_name}-fp-default"
      selectors = [
        {
          namespace = "default"
        },
        {
          namespace = "kube-system"
        }
      ]
    }
  }

  tags = {}
}



resource "aws_eks_access_entry" "eks_user_access" {
  cluster_name  = module.eks.cluster_name
  principal_arn = "arn:aws:iam::619071339639:user/${var.custom_name}"
  type          = "STANDARD"

  depends_on = [module.eks]
}
resource "aws_eks_access_policy_association" "eks_user_admin" {
  cluster_name  = local.cluster_name
  principal_arn = aws_eks_access_entry.eks_user_access.principal_arn
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSAdminPolicy"

  access_scope {
    type = "cluster"
  }

  depends_on = [
    module.eks,
    aws_eks_access_entry.eks_user_access
  ]
}



resource "aws_lb" "app_alb" {
  name               = "${var.custom_name}-react-app-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = var.public_subnet_ids

  security_groups = [aws_security_group.alb_sg.id]
}

resource "aws_lb_target_group" "fargate_tg" {
  name     = "${var.custom_name}-react-app-tg"
  port     = 80
  protocol = "HTTP"
  target_type = "ip"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fargate_tg.arn
  }
}


resource "aws_security_group" "alb_sg" {
  name        = "${var.custom_name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow HTTP from your IP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = local.personal_cidr_blocks
  }

   ingress {
    description = "Allow HTTPS from your IP"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = local.personal_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}



resource "aws_security_group_rule" "allow_alb_to_eks_cluster_sg" {
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  description              = "Allow traffic from ALB to Fargate pods"
  security_group_id        = data.aws_security_groups.eks_cluster_sgs.ids[0]
  source_security_group_id = aws_security_group.alb_sg.id
  depends_on               = [module.eks]
}



resource "aws_ecr_repository" "test-app" {
  name                 = "test-app-${var.custom_name}"
  image_tag_mutability = "MUTABLE"

}

resource "aws_iam_user_policy" "eks_full_inline_policy" {
  name = "eks-full-inline-policy"
  user = "${var.custom_name}"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
        {
			"Effect": "Allow",
			"Action": [
				"eks:CreateCluster",
				"eks:DescribeCluster",
				"eks:DescribeClusterVersions",
				"eks:DescribeAddonVersions",
				"eks:DescribeAddonConfiguration",
				"eks:ListClusters",
				"eks:DeleteCluster",
				"eks:UpdateClusterConfig",
				"eks:TagResource",
				"eks:DescribeAddon",
				"eks:CreateAddon",
				"eks:UpdateAddon",
				"eks:DeleteAddon",
				"eks:ListFargateProfiles",
				"eks:CreateFargateProfile",
				"eks:DeleteFargateProfile",
				"eks:DescribeFargateProfile",
				 "eks:DescribeAccessEntry",
                "eks:CreateAccessEntry",
                "eks:DeleteAccessEntry",
                "eks:ListAccessEntries",
                "eks:AssociateAccessPolicy",
                "eks:DisassociateAccessPolicy",
                "eks:ListAssociatedAccessPolicies"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"ecr:CreateRepository",
				"ecr:DescribeRepositories",
				"ecr:GetAuthorizationToken",
				"ecr:BatchCheckLayerAvailability",
				"ecr:PutImage",
				"ecr:InitiateLayerUpload",
				"ecr:UploadLayerPart",
				"ecr:CompleteLayerUpload"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"kms:CreateKey",
				"kms:TagResource",
				"kms:DescribeKey",
				"kms:CreateAlias"
			],
			"Resource": "*"
		},
      {
        Effect = "Allow",
        Action = [
          "kms:ListAliases",
          "kms:ListKeys",
          "kms:DescribeKey",
          "kms:CreateAlias",
          "kms:TagResource",
          "kms:CreateKey",
          "kms:EnableKeyRotation",
          "kms:GetKeyPolicy",
          "kms:PutKeyPolicy"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "logs:DescribeLogGroups",
          "logs:CreateLogGroup",
          "logs:PutRetentionPolicy"
        ],
        Resource = "*"
      },
      {
      "Effect": "Allow",
      "Action": "logs:*",
      "Resource": "*"
    }
    ]
  })
}

resource "aws_security_group" "eks_fargate_sg" {
  name        = "${var.custom_name}-eks-fargate-sg"
  description = "Security group for EKS Fargate pods"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow traffic from ALB"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource "aws_iam_user_policy_attachment" "attach_eks_cluster_policy" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}


resource "aws_iam_user_policy_attachment" "attach_ecr_full_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess"
}

resource "aws_iam_user_policy_attachment" "attach_ec2_full_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2FullAccess"
}

resource "aws_iam_user_policy_attachment" "attach_eks_service_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
}

resource "aws_iam_user_policy_attachment" "attach_elasticcontainer_public_full_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonElasticContainerRegistryPublicFullAccess"
}

resource "aws_iam_user_policy_attachment" "attach_vpc_full_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonVPCFullAccess"
}

resource "aws_iam_user_policy_attachment" "attach_cloudformation_full_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/AWSCloudFormationFullAccess"
}

resource "aws_iam_user_policy_attachment" "attach_lb_full_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess"
}

resource "aws_iam_user_policy_attachment" "attach_iam_full_access" {
  user       = "${var.aws_user}"
  policy_arn = "arn:aws:iam::aws:policy/IAMFullAccess"
}

resource "null_resource" "attach_fargate_pods" {
  triggers = {
    target_group_arn = aws_lb_target_group.fargate_tg.arn
    manifest_sha     = filesha1("${path.module}/deployment.yaml")
    cluster_endpoint = module.eks.cluster_endpoint
  }

  depends_on = [
    module.eks,
    aws_eks_access_entry.eks_user_access,
    aws_eks_access_policy_association.eks_user_admin,
    aws_lb_target_group.fargate_tg
  ]

  provisioner "local-exec" {
    command = <<EOT
aws eks update-kubeconfig --region ${var.region} --name ${local.cluster_name}

# Check cluster API access (not nodes - Fargate doesn't show nodes)
Write-Host "Checking cluster API access..."
$maxRetries = 15
$retries = 0
do {
    $null = kubectl get namespaces 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Cluster API is ready!"
        break
    }
    $retries++
    if ($retries -ge $maxRetries) {
        Write-Host "Cluster not accessible after $maxRetries attempts"
        exit 1
    }
    Write-Host "Waiting for cluster API... (attempt $retries/$maxRetries)"
    Start-Sleep -Seconds 20
} while ($true)

Write-Host "Applying deployment..."
kubectl apply -f "${path.module}/deployment.yaml"

Write-Host "Waiting for deployment rollout..."
kubectl rollout status deployment/test-app-${var.custom_name} -n default --timeout=600s

Write-Host "Waiting for pods to be ready..."
kubectl wait --for=condition=Ready pod -l app=test-app-${var.custom_name} -n default --timeout=600s

Write-Host "Allowing time for Fargate networking..."
Start-Sleep -Seconds 30

Write-Host "Getting pod IPs..."
$pods = kubectl get pods -n default -l app=test-app-${var.custom_name} -o jsonpath="{.items[*].status.podIP}"

if ($pods -and $pods.Trim()) {
    Write-Host "Found pod IPs: $pods"
    foreach ($ip in ($pods -split ' ')) {
        $ip = $ip.Trim()
        if ($ip -and $ip -match '^[\d\.]+$') {
            Write-Host "Registering pod IP $ip to target group..."
            try {
                aws elbv2 register-targets --target-group-arn ${aws_lb_target_group.fargate_tg.arn} --targets Id=$ip,Port=80
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "Successfully registered $ip"
                } else {
                    Write-Host "Failed to register $ip"
                }
            } catch {
                Write-Host "Error registering $ip : $_"
            }
        }
    }
} else {
    Write-Host "No pod IPs found! Checking pod status..."
    kubectl get pods -n default -l app=test-app-${var.custom_name} -o wide
    kubectl describe pods -n default -l app=test-app-${var.custom_name}
    exit 1
}

Write-Host "Pod registration completed!"
EOT
    interpreter = ["PowerShell", "-Command"]
  }

  provisioner "local-exec" {
    when    = destroy
    command = <<EOT
Write-Host "Cleaning up target group registrations..."
$targets = aws elbv2 describe-target-health --target-group-arn ${self.triggers.target_group_arn} --query 'TargetHealthDescriptions[].Target.Id' --output text 2>$null

if ($targets -and $targets.Trim()) {
    foreach ($target in ($targets -split "`t")) {
        $target = $target.Trim()
        if ($target -and $target -match '^[\d\.]+$') {
            Write-Host "Deregistering target $target..."
            try {
                aws elbv2 deregister-targets --target-group-arn ${self.triggers.target_group_arn} --targets Id=$target,Port=80
                Write-Host "Successfully deregistered $target"
            } catch {
                Write-Host "Error deregistering $target : $_"
            }
        }
    }
} else {
    Write-Host "No targets found to deregister"
}
EOT
    interpreter = ["PowerShell", "-Command"]
  }
}
