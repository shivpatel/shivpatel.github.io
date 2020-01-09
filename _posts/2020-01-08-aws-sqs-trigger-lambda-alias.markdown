---
layout: post
title:  "Using AWS SQS to trigger Lambda aliases"
date:   2020-01-08 20:00:00 -0500
categories: devops
---
There are plenty of good posts out there showing you how to trigger Lambda via SQS. But I couldn't find one that specifically shows how to trigger an alias. I ended up contacting AWS Support and came to the following solution: 

If you're using terraform, make sure to use the alias `ARN` when defining your `aws_lambda_event_source_mapping`.

{% highlight terraform %}
resource "aws_lambda_alias" "test_alias" {
  name             = "testalias"
  function_name    = "${aws_lambda_function.lambda_function_test.arn}"
}

resource "aws_lambda_event_source_mapping" "example" {
  event_source_arn = "${aws_sqs_queue.sqs_queue_test.arn}"
  function_name    = "${aws_lambda_alias.test_alias.arn}"
}
{% endhighlight %}

If you're using the AWS Console, the trick is to setup the trigger via the Lambda Alias page, not via the SQS dashboard.

![Add Trigger via Lambda Alias Console Page](/assets/lambda-alias-add-trigger.png)

<br/>

![Add SQS Trigger](/assets/lambda-add-sqs-trigger.png)