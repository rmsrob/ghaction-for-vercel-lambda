# Manage Vercel Lambda with GH Actions

> Manage a repository of lambda to be deployed on Vercel

## Why ?

This happend when you can't or don't want to go with the Vercel Github integrations, and have a repository with many lambda that need different domain name with their endpoints. You also want to build your own personalized granular steps.

## Setup Github Action

> Requirement for GITHUB SECRET in `settings/secrets/actions`:

- VERCEL_TOKEN (to get with scope on your Vercel dashboard)
- VERCEL_ORG_ID (see your vercel project)
- VERCEL_PROJECT_ID (see your vercel project)
- GH_PAT (GitHub Personal Access Token may to help authorized a specific GitHub user)

## Use Case

- Deploy the lambda only if some changes was pushed
- Deploy to a different domain if we are on develop or master branch
- Deploy with `vercel --dev` only when this is a PR
- Deploy with `vercel --prod` only if the PR is merged
- Have some custom tests inside the GitHub Action

> We need 2 vercel projects and get their `PROJECT_ID`, let's assign them for prod (master) and dev for develop branch.

We can manage each folders inside `lamdba` with their own githug worlflows `.yml`.
We just need to edit the upper part like so:

```yml
name: Deploy Vercel Lambda - lambda-test # here for the name
on:
  pull_request:
  pull_request_target:
    types:
      - closed
    paths:
      - 'lambda/lambda-test/**' # here to trigger only the path who got some changes

  workflow_dispatch:

env:
  LAMBDA_PATH: 'lambda/lambda-test' # here to record the path
  PROJECT_ID_DEV: ${{ secrets.VERCEL_PROJECT_ID_TEST_DEV }} # here as many as needed
  PROJECT_ID_PROD: ${{ secrets.VERCEL_PROJECT_ID_TEST_PROD }} # here as many as needed
```

> We levrage the `PROJECT_ID` to be dynamicly assigned depending on the branch we will PR on. We used `=~` operator to match here the most basic regex.

```sh
if [[ ${GITHUB_BASE_REF} =~ "master" || ${GITHUB_BASE_REF} =~ "main" ]]; then
    echo "PROJECT_ID=${PROJECT_ID_PROD}" >> $GITHUB_ENV
elif [[ ${GITHUB_BASE_REF} =~ "develop" ]]; then
    echo "PROJECT_ID=${PROJECT_ID_DEV}" >> $GITHUB_ENV
else
    echo "PROJECT_ID=nope" >> $GITHUB_ENV
fi
echo "BRANCH ${GITHUB_HEAD_REF} FROM ${{ github.base_ref }}"
```