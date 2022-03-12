import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct, Node } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkSampleCfEdgeFunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Define S3 bucket to be used as the origin
    const s3Bucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: false
    });

    // Upload content to the S3 bucket defined above
    const asset = new s3deploy.BucketDeployment(this, 'SampleAsset', {
      sources: [s3deploy.Source.asset('./assets')],
      destinationBucket: s3Bucket,
      destinationKeyPrefix: 'new_path'
    });

    // Define a cloudfront Function to be used in the Distribution
    const functionId = `MyFunction${Node.of(this).addr}`;
    const cfFunction = new cloudfront.Function(this, 'Function', {
      code: cloudfront.FunctionCode.fromFile({filePath: './edge-functions/rewrite.js'}),
      functionName: functionId,  // Work around so that can update the function. https://github.com/aws/aws-cdk/issues/15523
    });

    // Define a distribution that uses the S3 bucket and the function
    new cloudfront.Distribution(this, 'MyDistribution', {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: new origins.S3Origin(s3Bucket),
        functionAssociations: [{
          function: cfFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
    });
  }
}
