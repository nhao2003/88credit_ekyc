// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

/** 
Assumptions
* Finanicial Institutions - Organization
* Users - Customer
* Super Admin - Admin
*/

import "./Customers.sol";
import "./Organizations.sol";

/**
 * @title KYC
 * @author Suresh Konakanchi
 * @dev Library for managing KYC process seemlessly using de-centralised system
 */
contract KYC is Customers, Organizations {
    address admin;
    address[] internal userList;

    mapping(address => Types.User) internal users;
    mapping(string => Types.KycRequest) internal kycRequests;
    mapping(address => address[]) internal organizationCustomers; // All customers associated to a Organization
    mapping(address => address[]) internal customerorganizations; // All organizations associated to a Customer

    /**
     * @notice Set admin to one who deploy this contract
     * Who will act as the super-admin to add all the financial institutions (organizations)
     * @param name_ Name of the admin
     * @param email_ Email of the admin
     */
    constructor(string memory name_, string memory email_) {
        admin = msg.sender;
        Types.User memory usr_ = Types.User({
            name: name_,
            email: email_,
            id_: admin,
            role: Types.Role.Admin,
            status: Types.OrganizationStatus.Active
        });
        users[admin] = usr_;
        userList.push(admin);
    }

    // Modifiers

    /**
     * @notice Checks whether the requestor is admin
     */
    modifier isAdmin() {
        require(msg.sender == admin, "Only admin is allowed");
        _;
    }

    // Support functions

    /**
     * @notice Checks whether the KYC request already exists
     * @param reqId_ Unique Id of the KYC request
     * @return boolean which says request exists or not
     */
    function kycRequestExists(string memory reqId_)
        internal
        view
        returns (bool)
    {
        require(!Helpers.compareStrings(reqId_, ""), "Request Id empty");
        return Helpers.compareStrings(kycRequests[reqId_].id_, reqId_);
    }

    /**
     * @notice All kyc requests. Data will be sent in pages to avoid the more gas fee
     * @param pageNumber page number for which data is needed (1..2..3....n)
     * @param isForOrganization List needed for organization or for customer
     * @return totalPages Total pages available
     * @return KycRequest[] List of KYC requests in the current page
     */
    function getKYCRequests(uint256 pageNumber, bool isForOrganization)
        internal
        view
        returns (uint256 totalPages, Types.KycRequest[] memory)
    {
        require(pageNumber > 0, "PN should be > zero");
        (
            uint256 pages,
            uint256 pageLength_,
            uint256 startIndex_,
            uint256 endIndex_
        ) = Helpers.getIndexes(
                pageNumber,
                isForOrganization
                    ? organizationCustomers[msg.sender]
                    : customerorganizations[msg.sender]
            );
        Types.KycRequest[] memory list_ = new Types.KycRequest[](pageLength_);
        for (uint256 i = startIndex_; i < endIndex_; i++)
            list_[i] = isForOrganization
                ? kycRequests[
                    Helpers.append(msg.sender, organizationCustomers[msg.sender][i])
                ]
                : kycRequests[
                    Helpers.append(customerorganizations[msg.sender][i], msg.sender)
                ];
        return (pages, list_);
    }

    // Events

    event KycRequestAdded(string reqId, string organizationName, string customerName);
    event KycReRequested(string reqId, string organizationName, string customerName);
    event KycStatusChanged(
        string reqId,
        address customerId,
        address organizationId,
        Types.KycStatus status
    );
    event DataHashPermissionChanged(
        string reqId,
        address customerId,
        address organizationId,
        Types.DataHashStatus status
    );

    // Admin Interface

    /**
     * @dev All the organizations list. Data will be sent in pages to avoid the more gas fee
     * @param pageNumber page number for which data is needed (1..2..3....n)
     * @return totalPages Total pages available
     * @return Organization[] List of organizations in the current page
     */
    function getAllOrganizations(uint256 pageNumber)
        public
        view
        isAdmin
        returns (uint256 totalPages, Types.Organization[] memory)
    {
        return getallorganizations(pageNumber);
    }

    /**
     * @dev To add new organization account
     * @param organization_ Organization details, which need to be added to the system
     */
    function addOrganization(Types.Organization memory organization_) public isAdmin {
        addorganization(organization_);
        // Adding to common list
        users[organization_.id_] = Types.User({
            name: organization_.name,
            email: organization_.email,
            id_: organization_.id_,
            role: Types.Role.Organization,
            status: Types.OrganizationStatus.Active
        });
        userList.push(organization_.id_);
    }

    /**
     * @dev To add new organization account
     * @param id_ Organization's metamask address
     * @param email_ Organization's email address that need to be updated
     * @param name_ Organization's name which need to be updated
     */
    function updateOrganizationDetails(
        address id_,
        string memory email_,
        string memory name_
    ) public isAdmin {
        updateorganization(id_, email_, name_);
        // Updating in common list
        users[id_].name = name_;
        users[id_].email = email_;
    }

    /**
     * @dev To add new organization account
     * @param id_ Organization's metamask address
     * @param makeActive_ If true, organization will be marked as active, else, it will be marked as deactivateds
     */
    function activateDeactivateOrganization(address id_, bool makeActive_)
        public
        isAdmin
    {
        // Updating in common list
        users[id_].status = activatedeactivateorganization(id_, makeActive_);
    }

    // Organization Interface

    /**
     * @dev List of customers, who are linked to the current organization. Data will be sent in pages to avoid the more gas fee
     * @param pageNumber page number for which data is needed (1..2..3....n)
     * @return totalPages Total pages available
     * @return KycRequest[] List of KYC requests in the current page
     */
    function getCustomersOfOrganization(uint256 pageNumber)
        public
        view
        isValidOrganization(msg.sender)
        returns (uint256 totalPages, Types.KycRequest[] memory)
    {
        return getKYCRequests(pageNumber, true);
    }

    /**
     * @notice Records new KYC request for a customer
     * @param customer_ Customer details for whom the request is to be raised
     * @param currentTime_ Current Date & Time in unix epoch timestamp
     * @param notes_ Any additional notes that need to be added
     */
    function addKycRequest(
        Types.Customer memory customer_,
        uint256 currentTime_,
        string memory notes_
    ) public isValidOrganization(msg.sender) {
        string memory reqId_ = Helpers.append(msg.sender, customer_.id_);
        require(!kycRequestExists(reqId_), "User had kyc req.");

        kycRequests[reqId_] = Types.KycRequest({
            id_: reqId_,
            userId_: customer_.id_,
            customerName: customer_.name,
            organizationId_: msg.sender,
            organizationName: getsingleorganization(msg.sender).name,
            dataHash: customer_.dataHash,
            updatedOn: currentTime_,
            status: Types.KycStatus.Pending,
            dataRequest: Types.DataHashStatus.Pending,
            additionalNotes: notes_
        });
        organizationCustomers[msg.sender].push(customer_.id_);
        customerorganizations[customer_.id_].push(msg.sender);
        emit KycRequestAdded(
            reqId_,
            kycRequests[reqId_].organizationName,
            customer_.name
        );

        if (!customerExists(customer_.id_)) {
            addcustomer(customer_);
            // Adding to common list
            users[customer_.id_] = Types.User({
                name: customer_.name,
                email: customer_.email,
                id_: customer_.id_,
                role: Types.Role.Customer,
                status: Types.OrganizationStatus.Active
            });
            userList.push(customer_.id_);
        }
    }

    /**
     * @notice Updates existing KYC request for a customer (It's a re-request)
     * @param id_ Customer ID for whom the request has to be re-raised
     * @param notes_ Any additional notes that need to be added
     */
    function reRequestForKycRequest(address id_, string memory notes_)
        public
        isValidOrganization(msg.sender)
    {
        string memory reqId_ = Helpers.append(msg.sender, id_);
        require(kycRequestExists(reqId_), "KYC req not found");
        require(customerExists(id_), "User not found");

        // kycRequests[reqId_].status = Types.KycStatus.Pending;
        kycRequests[reqId_].dataRequest = Types.DataHashStatus.Pending;
        kycRequests[reqId_].additionalNotes = notes_;

        emit KycReRequested(
            reqId_,
            kycRequests[reqId_].organizationName,
            kycRequests[reqId_].customerName
        );
    }

    /**
     * @dev To mark the KYC verification as failure
     * @param userId_ Id of the user
     * @param userId_ KYC Verified
     * @param note_ Any info that need to be shared
     */
    function updateKycVerification(
        address userId_,
        bool verified_,
        string memory note_
    ) public isValidOrganization(msg.sender) {
        string memory reqId_ = Helpers.append(msg.sender, userId_);
        require(kycRequestExists(reqId_), "User doesn't have KYC req");

        Types.KycStatus status_ = Types.KycStatus.Pending;
        if (verified_) {
            status_ = Types.KycStatus.KYCVerified;
            updatekyccount(msg.sender);
            updatekycdoneby(userId_);
        } else {
            status_ = Types.KycStatus.KYCFailed;
        }

        kycRequests[reqId_].status = status_;
        kycRequests[reqId_].additionalNotes = note_;
        emit KycStatusChanged(reqId_, userId_, msg.sender, status_);
    }

    /**
     * @dev Search for customer details in the list that the organization is directly linked to
     * @param id_ Customer's metamask Id
     * @return boolean to say if customer exists or not
     * @return Customer object to get the complete details of the customer
     * @return KycRequest object to get the details about the request & it's status
     * Costly operation if we had more customers linked to this single organization
     */
    function searchCustomers(address id_)
        public
        view
        isValidCustomer(id_)
        isValidOrganization(msg.sender)
        returns (
            bool,
            Types.Customer memory,
            Types.KycRequest memory
        )
    {
        bool found_;
        Types.Customer memory customer_;
        Types.KycRequest memory request_;
        (found_, customer_) = searchcustomers(id_, organizationCustomers[msg.sender]);
        if (found_) request_ = kycRequests[Helpers.append(msg.sender, id_)];
        return (found_, customer_, request_);
    }

    // Customer Interface

    /**
     * @notice List of all organizations. Data will be sent in pages to avoid the more gas fee
     * @dev This is customer facing RPC end point
     * @param pageNumber page number for which data is needed (1..2..3....n)
     * @return totalPages Total pages available
     * @return KycRequest[] List of KYC requests in the current page
     */
    function getOrganizationRequests(uint256 pageNumber)
        public
        view
        isValidCustomer(msg.sender)
        returns (uint256 totalPages, Types.KycRequest[] memory)
    {
        return getKYCRequests(pageNumber, false);
    }

    /**
     * @dev Updates the KYC request (Either Approves or Rejects)
     * @param organizationId_ Id of the organization
     * @param approve_ Approve the data hash or reject
     * @param note_ Any info that need to be shared
     */
    function actionOnKycRequest(
        address organizationId_,
        bool approve_,
        string memory note_
    ) public isValidCustomer(msg.sender) isValidOrganization(organizationId_) {
        string memory reqId_ = Helpers.append(organizationId_, msg.sender);
        require(kycRequestExists(reqId_), "User doesn't have KYC req");

        Types.DataHashStatus status_ = Types.DataHashStatus.Pending;
        if (approve_) {
            status_ = Types.DataHashStatus.Approved;
        } else {
            status_ = Types.DataHashStatus.Rejected;
        }
        kycRequests[reqId_].dataRequest = status_;
        kycRequests[reqId_].additionalNotes = note_;

        emit DataHashPermissionChanged(reqId_, msg.sender, organizationId_, status_);
    }

    /**
     * @dev Updates the user profile
     * @param name_ Customer name
     * @param email_ Email that need to be updated
     * @param mobile_ Mobile number that need to be updated
     */
    function updateProfile(
        string memory name_,
        string memory email_,
        string memory mobile_
    ) public isValidCustomer(msg.sender) {
        updateprofile(name_, email_, mobile_);
        // Updating in common list
        users[msg.sender].name = name_;
        users[msg.sender].email = email_;
    }

    /**
     * @dev Updates the Datahash of the documents
     * @param hash_ Data hash value that need to be updated
     * @param currentTime_ Current Date Time in unix epoch timestamp
     */
    function updateDatahash(string memory hash_, uint256 currentTime_)
        public
        isValidCustomer(msg.sender)
    {
        updatedatahash(hash_, currentTime_);

        // Reset KYC verification status for all organizations
        address[] memory organizationsList_ = customerorganizations[msg.sender];
        for (uint256 i = 0; i < organizationsList_.length; i++) {
            string memory reqId_ = Helpers.append(organizationsList_[i], msg.sender);
            if (kycRequestExists(reqId_)) {
                kycRequests[reqId_].dataHash = hash_;
                kycRequests[reqId_].updatedOn = currentTime_;
                kycRequests[reqId_].status = Types.KycStatus.Pending;
                kycRequests[reqId_].additionalNotes = "Updated all my docs";
            }
        }
    }

    /**
     * @dev Removes the permission to a specific organization, so that they can't access the documents again
     * @param organizationId_ Id of the organization to whom permission has to be revoked
     * @param notes_ Any additional notes that need to included
     */
    function removerDatahashPermission(address organizationId_, string memory notes_)
        public
        isValidCustomer(msg.sender)
    {
        string memory reqId_ = Helpers.append(organizationId_, msg.sender);
        require(kycRequestExists(reqId_), "Permission not found");
        kycRequests[reqId_].dataRequest = Types.DataHashStatus.Rejected;
        kycRequests[reqId_].additionalNotes = notes_;
        emit DataHashPermissionChanged(
            reqId_,
            msg.sender,
            organizationId_,
            Types.DataHashStatus.Rejected
        );
    }

    /**
     * @dev Search for organization details in the list that the customer is directly linked to
     * @param organizationId_ Organization's metamask Id
     * @return boolean to say if organization exists or not
     * @return Organization object to get the complete details of the organization
     * @return KycRequest object to get the details about the request & it's status
     * Costly operation if we had more organizations linked to this single customer
     */
    function searchOrganizations(address organizationId_)
        public
        view
        isValidCustomer(msg.sender)
        isValidOrganization(organizationId_)
        returns (
            bool,
            Types.Organization memory,
            Types.KycRequest memory
        )
    {
        bool found_;
        Types.Organization memory organization_;
        Types.KycRequest memory request_;
        address[] memory organizations_ = customerorganizations[msg.sender];

        for (uint256 i = 0; i < organizations_.length; i++) {
            if (organizations_[i] == organizationId_) {
                found_ = true;
                organization_ = getsingleorganization(organizationId_);
                request_ = kycRequests[Helpers.append(organizationId_, msg.sender)];
                break;
            }
        }
        return (found_, organization_, request_);
    }

    // Common Interface

    /**
     * @dev Updates the KYC request (Either Approves or Rejects)
     * @return User object which contains the role & other basic info
     */
    function whoAmI() public view returns (Types.User memory) {
        require(msg.sender != address(0), "Sender Id Empty");
        require(users[msg.sender].id_ != address(0), "User Id Empty");
        return users[msg.sender];
    }

    /**
     * @dev To get details of the customer
     * @param id_ Customer's metamask address
     * @return Customer object which will have complete details of the customer
     */
    function getCustomerDetails(address id_)
        public
        view
        isValidCustomer(id_)
        returns (Types.Customer memory)
    {
        return getcustomerdetails(id_);
    }

    /**
     * @dev To get details of the organization
     * @param id_ Organization's metamask address
     * @return Organization object which will have complete details of the organization
     */
    function getOrganizationDetails(address id_)
        public
        view
        isValidOrganization(id_)
        returns (Types.Organization memory)
    {
        return getsingleorganization(id_);
    }
}
