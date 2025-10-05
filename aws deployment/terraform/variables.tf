variable "region" {
  type = string
default = "eu-west-1"
}

variable "vpc_id" {
  default = "vpc-03763396c7ad1e07a"
}

variable "private_subnet_ids" {
  type    = list(string)
  default = ["subnet-006fbe07c6331b7e5", "subnet-0c9e6a7043df9ec3a", "subnet-001248f21d5cf2ea1"]
}

variable "public_subnet_ids"{
    type = list(string)
    default = ["subnet-0ccb12e11ee9f5f7c", "subnet-0f281383718f2259b", "subnet-0f0164279e14f807d"]
}

variable "tags" {
  type = map(string)
  default = {
    environment = "dev"
    terraform   = "true"
  }
}

variable "personal_cidr_blocks" {
  description = "CIDR blocks to allow access from. Defaults to current IP if empty"
  type        = list(string)
  default     = []
}

variable "custom_name" {
  type = string
  default = "deploy"
}
