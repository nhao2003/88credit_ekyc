const Types = artifacts.require('Types');
const Helpers = artifacts.require('Helpers');
const Customers = artifacts.require('Customers');
const Organizations = artifacts.require('Organizations');
const KYC = artifacts.require('KYC');

module.exports = function (deployer, network, accounts) {
  console.table(accounts);

  if (network == 'development') {
    deployer.deploy(Helpers);
    deployer.deploy(Types);
    deployer.link(Helpers, Customers);
    deployer.link(Types, Customers);
    deployer.deploy(Customers);
    deployer.link(Helpers, Organizations);
    deployer.link(Types, Organizations);
    deployer.deploy(Organizations);
    deployer.deploy(KYC, 'Suresh', 'suresh@geekyants.com');
  } else {
    // For live & test networks

    deployer.deploy(Helpers);
    deployer.deploy(Types);
    deployer.link(Helpers, Customers);
    deployer.link(Types, Customers);
    deployer.deploy(Customers);
    deployer.link(Helpers, Organizations);
    deployer.link(Types, Organizations);
    deployer.deploy(Organizations);
    deployer.deploy(KYC, 'Suresh', 'suresh@geekyants.com');
  }
};
