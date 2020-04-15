// Description:
//   Runs continuous dev deploy based on slack messages
//
// Commands:
//   hubot deploy dev - deploys api dev as root
//
// Author:
//   brian lai

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const deployScriptPath = '/home/hubot/DeploymentScripts/hubot';
const authorizedSlackUsers = ['bkoh', 'jgachnang', 'blai', 'devops'];

module.exports = function(robot) {
  robot.respond(/deploy dev ([\w-\.]+)$/i, async (msg) => {
    robot.logger.info(`attempting to deploy dev by user's command, user=${msg.message.user}`);
    if (!authorizedSlackUsers.includes(msg.message.user.name)) {
      robot.logger.error(`Unauthorized user ${msg.message.user.name}`);
      msg.reply(`You don't have the authoritah!!!`);
    }
    let deployTag = msg.match[1].toLowerCase();
    msg.reply('Starting api dev continuous deploy.');
    try {
      let {stdout, stderr} = await exec(`${deployScriptPath}/dev.deploy_api.sh ${deployTag}`);
      if (stdout) {
        robot.logger.info(`stdout: ${stdout}`);
      }
      if (stderr) {
        robot.logger.info(`stderr: ${stderr}`);
      }
    } catch (e) {
      robot.logger.error(e);
      msg.reply(`an error occurred.\n${e}`);
    }
  });
};
