import 'dotenv/config'
import { listRepoSecrets } from "./api";

const token = process.env.GITHUB_TOKEN

console.log(token)

// listRepoSecrets()