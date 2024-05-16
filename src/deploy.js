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
const authorizedSlackUsers = ['avespoli', 'devops', 'jlyons'];

const os = require('os');
const hostname = os.hostname();
const hostEnv = hostname.split(/[-.]/)[1];

module.exports = function(robot) {
  robot.respond(/deploy (\w+) ([\w-\.]+) (.+)$/i, async (msg) => {
    let environment = msg.match[1].toLowerCase();
    let deployTag = msg.match[2].toLowerCase();
    let artifactUrl = msg.match[3].toLowerCase();
    
    // this is a hack because prod doesnt have prd and its expecting 
    // it to based off this code. I am not dealing with reworking it right now
    if (environment != hostEnv || (environment === 'prd' && hostEnv !== 'sonarmd')) { 
      robot.logger.error(`environment mismatch:  ${environment}`);
      robot.logger.error(`hostEnv: ${hostEnv}`);  
      return;
    }
    robot.logger.info(
      `attempting to deploy ${environment} by user's command, user=${JSON.stringify(msg.message.user)}`
    );
    if (msg.message.user.name && !authorizedSlackUsers.includes(msg.message.user.name)) {
      robot.logger.error(`Unauthorized user ${msg.message.user.name}`);
      msg.reply(`You don't have the authoritah!!!`);
      return;
    }
    msg.reply(`Starting ${environment}:${deployTag} continuous deploy.`);
    try {
      let {stdout, stderr} = await exec(`sudo ${deployScriptPath}/deploy_api.sh ${environment} ${deployTag} ${artifactUrl}`);
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
