import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkSampleCfEdgeFunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Add a cloudfront Function to a Distribution
    const cfFunction = new cloudfront.Function(this, 'Function', {
      code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
    });

    const s3Bucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: false
    });

    const asset = new s3deploy.BucketDeployment(this, 'SampleAsset', {
      sources: [s3deploy.Source.asset('./assets/test.html')],
      destinationBucket: s3Bucket,
      destinationKeyPrefix: 'test_site'
    });

    new cloudfront.Distribution(this, 'MyDistribution', {
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
