variable "region" {
  type = string
default = "eu-west-1"
}

variable "vpc_id" {
  default = "vpc-0e0ba0bc21d15729a"
}

variable "private_subnet_ids" {
  type    = list(string)
  default = ["subnet-07bfff5dd87c15b99", "subnet-072b820d9cd3a506b"]
}

variable "public_subnet_ids"{
    type = list(string)
    default = ["subnet-03a64fd8788a57ea8", "subnet-0e172472a0c0f9de0"]
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
  default     = ["0.0.0.0/0"]
}

variable "custom_name" {
  type = string
  default = "ethan"
}

variable "aws_user" {
  type = string
  default = "ethan"
}
