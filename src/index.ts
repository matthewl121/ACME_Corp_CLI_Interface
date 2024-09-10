import RampUpTimeMetric from "./RampUpTimeMetric";

const rampUpTimeMetric = new RampUpTimeMetric(process.env.GITHUB_TOKEN!, process.env.OWNER!, process.env.REPO!);

console.log(await rampUpTimeMetric.getCollaborators());