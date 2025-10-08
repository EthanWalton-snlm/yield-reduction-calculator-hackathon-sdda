locals {
  fargate_profiles = {
    for ns in local.fargate_namespaces : ns => {
      selectors = [
        {
          namespace = ns
        }
      ]
    }
  }

  personal_cidr_blocks = length(var.personal_cidr_blocks) > 0 ? var.personal_cidr_blocks : ["${chomp(data.http.my_ip.response_body)}/32"]

  cluster_name = "${var.custom_name}-eks-proj-cluster"

  fargate_namespaces = [
    "default",
    "${var.custom_name}-fargate"
  ]

}
