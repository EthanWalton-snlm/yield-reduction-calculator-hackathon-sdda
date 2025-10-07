# AWS Deployment with EKS cluster and Fargate profile

1. Create IAM user with relevant permissions
2. Local machine (in directory of the project):
   1. `cd <project_name>`
   2. `aws configure`
   3. `aws ecr create-repository --repository-name deploy-test-app --region eu-west-1`
   4. `aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin <accountID>.dkr.ecr.eu-west-1.amazonaws.com`
   5. `docker build -t deploy-test-app .`
   6. `docker tag deploy-test-app:latest 043516549334.dkr.ecr.eu-west-1.amazonaws.com/deploy-test-app:latest`
   7. `docker push 043516549334.dkr.ecr.eu-west-1.amazonaws.com/deploy-test-app:latest`
   8. `cd terraform`
   9. `Change VPC and Subnet IDs`
   10. `terraform init`
   11. `terraform plan`
   12. `terraform apply`
3. Visit Load balancer DNS

## Cleanup

1. `terraform destroy`
2. Delete ECR and user
