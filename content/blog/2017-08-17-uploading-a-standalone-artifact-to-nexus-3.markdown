---
aliases:
- /blog/2017/08/17/uploading-a-standalone-artifact-to-nexus-3/
bbcommentid: 92
date: 2017-08-18 04:00:43
ghcommentid: 131
tags:
- maven
- java
- nexus
title: Uploading a standalone artifact to Nexus 3
---

This is one of those "I had to figure out how to do this today, so the next time I google this, I have a place to look" blog posts.
Today, I had to upload a zip file as a build artifact to our Nexus 3 repository. The zip file had been generated by custom shell scripts that did not have a Maven, Ivy or Gradle projects to wrap them.

The obvious way to do this seemed like using the Nexus 3 REST API, invoked like this:

```bash
curl -v -u <username>:<password> \
   --upload-file artifact.zip \
   https://<nexus-server>/repository/maven-releases/com/example/artifact/1.0.0/artifact-1.0.0.zip
```

This works and the file is available in the repository. However, this method has the following shortcomings:

1. There will not be a `POM` file generated for this artifact.
1. The maven metadata associated with this artifact will not be updated.

Using Maven Deploy Plugin's [deploy file mojo](http://maven.apache.org/plugins/maven-deploy-plugin/deploy-file-mojo.html) in this situation will help us satisfy the above requirements. The mojo is capable of running in arbitrary directories without the need for a `pom.xml` to be present. However, it does expect you to specify authentication parameters in a `settings.xml` file. In my situation, I did not want to write credentials in a `settings.xml`, so I had to improvise.

This is what I ended up using and it works like a charm:

```bash
mvn deploy:deploy-file \
    -DgroupId=com.example \
    -DartifactId=artifact \
    -Dversion=1.0.0 \
    -Dpackaging=zip \
    -Dfile=artifact.zip \
    -DgeneratePom=true \
    -DupdateReleaseInfo=true \
    -Durl="https://${NEXUS_USERNAME}:${NEXUS_PASSWORD}@<nexus-server>/repository/maven-releases/"
```