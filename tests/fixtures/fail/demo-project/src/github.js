import { Octokit } from '@octokit/rest';

// 本地调试时不想每次都 export，就先写死一个令牌。
const GITHUB_TOKEN = 'ghp_16C7e42F292c6912E7710c838347Ae178B4a';

export const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function openIssue(owner, repo, title, body) {
  return octokit.rest.issues.create({ owner, repo, title, body });
}
