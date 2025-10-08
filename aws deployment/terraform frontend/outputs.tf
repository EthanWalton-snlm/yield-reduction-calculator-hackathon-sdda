output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "app_dns" {
  value = "http://${aws_lb.app_alb.dns_name}"
}
