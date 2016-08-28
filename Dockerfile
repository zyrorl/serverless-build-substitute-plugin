# Access to lambda docker provided through aws ecr login obtained by aws cli
# `aws ecr get-login --region us-east-1
FROM 257015880742.dkr.ecr.us-east-1.amazonaws.com/gitlab_ci/lambda-nodejs

VOLUME ["/app"]
WORKDIR /app
