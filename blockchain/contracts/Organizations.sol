// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

import "./Types.sol";
import "./Helpers.sol";

contract Organizations {
    address[] internal organizationList;
    mapping(address => Types.Organization) internal organizations;

    // Events

    event OrganizationAdded(address id_, string name, string email, string ifscCode);
    event OrganizationUpdated(address id_, string name, string email);
    event OrganizationActivated(address id_, string name);
    event OrganizationDeactivated(address id_, string name);

    // Modifiers

    /**
     * @notice Checks whether the requestor is organization & is active
     * @param id_ Metamask address of the organization
     */
    modifier isValidOrganization(address id_) {
        require(organizations[id_].id_ != address(0), "Organization not found");
        require(organizations[id_].id_ == id_, "Organization not found");
        require(
            organizations[id_].status == Types.OrganizationStatus.Active,
            "Organization is not active"
        );
        _;
    }

    // Contract Methods

    /**
     * @dev All the organizations list. Data will be sent in pages to avoid the more gas fee
     * @param pageNumber page number for which data is needed (1..2..3....n)
     * @return totalPages Total pages available
     * @return Organization[] List of organizations in the current page
     */
    function getallorganizations(uint256 pageNumber)
        internal
        view
        returns (uint256 totalPages, Types.Organization[] memory)
    {
        require(pageNumber > 0, "PN should be > 0");
        (
            uint256 pages,
            uint256 pageLength_,
            uint256 startIndex_,
            uint256 endIndex_
        ) = Helpers.getIndexes(pageNumber, organizationList);

        Types.Organization[] memory organizationsList_ = new Types.Organization[](pageLength_);
        for (uint256 i = startIndex_; i < endIndex_; i++)
            organizationsList_[i] = organizations[organizationList[i]];
        return (pages, organizationsList_);
    }

    /**
     * @dev To get details of the single organization
     * @param id_ metamask address of the requested organization
     * @return Organization Details of the organization
     */
    function getsingleorganization(address id_)
        internal
        view
        returns (Types.Organization memory)
    {
        require(id_ != address(0), "Organization Id Empty");
        return organizations[id_];
    }

    /**
     * @dev To add new organization account
     * @param organization_ Organization details, which need to be added to the system
     */
    function addorganization(Types.Organization memory organization_) internal {
        require(organizations[organization_.id_].id_ == address(0), "Organization exists");

        organizations[organization_.id_] = organization_;
        organizationList.push(organization_.id_);
        emit OrganizationAdded(organization_.id_, organization_.name, organization_.email, organization_.ifscCode);
    }

    /**
     * @dev To add new organization account
     * @param id_ Organization's metamask address
     * @param email_ Organization's email address that need to be updated
     * @param name_ Organization's name which need to be updated
     */
    function updateorganization(
        address id_,
        string memory email_,
        string memory name_
    ) internal {
        require(organizations[id_].id_ != address(0), "Organization not found");

        organizations[id_].name = name_;
        organizations[id_].email = email_;
        emit OrganizationUpdated(id_, name_, email_);
    }

    /**
     * @dev To add new organization account
     * @param id_ Organization's metamask address
     * @param makeActive_ If true, organization will be marked as active, else, it will be marked as deactivateds
     * @return OrganizationStatus current status of the organization to update in common list
     */
    function activatedeactivateorganization(address id_, bool makeActive_)
        internal
        returns (Types.OrganizationStatus)
    {
        require(organizations[id_].id_ != address(0), "Organization not found");

        if (makeActive_ && organizations[id_].status == Types.OrganizationStatus.Inactive) {
            organizations[id_].status = Types.OrganizationStatus.Active;
            emit OrganizationActivated(id_, organizations[id_].name);

            // Updating in common list
            return Types.OrganizationStatus.Active;
        } else if (
            !makeActive_ && organizations[id_].status == Types.OrganizationStatus.Active
        ) {
            organizations[id_].status = Types.OrganizationStatus.Inactive;
            emit OrganizationDeactivated(id_, organizations[id_].name);

            // Updating in common list
            return Types.OrganizationStatus.Inactive;
        } else {
            // Already upto date
            return organizations[id_].status;
        }
    }

    /**
     * @dev To update the kyc count that organization did
     * @param id_ Organization's metamask address
     */
    function updatekyccount(address id_) internal {
        require(id_ != address(0), "Organization not found");
        organizations[id_].kycCount++;
    }
}
