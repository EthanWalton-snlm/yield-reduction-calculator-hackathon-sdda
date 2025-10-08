data "aws_security_groups" "eks_cluster_sgs" {
  filter {
    name   = "group-name"
    values = ["eks-cluster-sg-${var.custom_name}-eks-proj-cluster*"]
  }
  depends_on = [module.eks]
}

data "http" "my_ip" {
  url = "https://checkip.amazonaws.com/"
}
