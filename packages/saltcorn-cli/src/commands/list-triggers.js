/**
 * @category saltcorn-cli
 * @module commands/run-trigger
 */
const { Command, flags } = require("@oclif/command");
const { cli } = require("cli-ux");
const { maybe_as_tenant, init_some_tenants } = require("../common");

/**
 * ListTriggerCommand Class
 * @extends oclif.Command
 * @category saltcorn-cli
 */
class ListTriggersCommand extends Command {
  /**
   * @returns {Promise<void>}
   */
  async run() {
    const {flags, args} = this.parse(ListTriggersCommand);
    await init_some_tenants(flags.tenant);

    const {mockReqRes} = require("@saltcorn/data/tests/mocks");
    const Trigger = require(`@saltcorn/data/models/trigger`);
    const that = this;
    await maybe_as_tenant(flags.tenant, async () => {
      const triggers = Trigger.find();
      if (!triggers) {
        console.log(`There are no triggers`);
        this.exit(1);
      }
      if(!flags.verbose){
        console.log('name');
      }
      else {
        console.log('' +
            'id,name,action,when_trigger,min_role,'+
            'channel,table_id,table_name,description'
        );
      }
      console.log('-------------------');
      for (let trigger of triggers){
        if(!flags.verbose)
          console.log(trigger.name);
        else{
          console.log(
              trigger.id
              +","+trigger.name
              +","+trigger.action
              +","+trigger.when_trigger
              +","+trigger.min_role
              +","+trigger.channel
              +","+trigger.table_id
              +","+trigger.table_name
              +","+trigger.description
          );
        }
      }
    });
    this.exit(0);
  }
}
/**
 * @type {string}
 */
ListTriggersCommand.description = `List triggers`;


/**
 * @type {object}
 */
ListTriggersCommand.flags = {
  tenant: flags.string({
    name: "tenant",
    char: "t",
    description: "tenant",
    required: false,
  }),
  verbose: flags.boolean({
    name: "verbose",
    char: "v",
    description: "verbose output",
    required: false,
  }),
};

module.exports = ListTriggersCommand;
