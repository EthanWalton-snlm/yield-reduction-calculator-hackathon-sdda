variable "region" {
  type = string
default = "eu-west-1"
}

variable "vpc_id" {
  default = "vpc-098ff0a57012ee924"
}

variable "private_subnet_ids" {
  type    = list(string)
  default = ["subnet-00d6f9601f9bd44be", "subnet-0fd7553b3309fae41", "subnet-01435e493609879c7"]
}

variable "public_subnet_ids"{
    type = list(string)
    default = ["subnet-05e0c4eeba2ecf2dd", "subnet-0b9a345a01c9a4c6b", "subnet-024c6701cf2527e53"]
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
  default = "hackathon"
}
