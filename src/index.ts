import 'dotenv/config';
import { listRepoSecrets } from "./api";

const token = process.env.GITHUB_TOKEN || ""

console.log(token)

const main = async () => {
    const response = await listRepoSecrets("matthewl121", "ACME_CLI_Interface", token)
    console.log(response)
}

main()
