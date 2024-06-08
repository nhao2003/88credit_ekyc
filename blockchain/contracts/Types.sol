// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

library Types {
    enum Role {
        Admin, // 0
        Organization, // 1
        Customer // 2
    }

    enum OrganizationStatus {
        Active, // 0
        Inactive // 1
    }

    enum KycStatus {
        Pending, // 0
        KYCVerified, // 1
        KYCFailed // 2
    }

    enum DataHashStatus {
        Pending, // 0
        Approved, // 1
        Rejected // 2
    }

    struct User {
        string name;
        string email;
        address id_;
        Role role;
        OrganizationStatus status;
    }

    struct Customer {
        string name;
        string email;
        string mobileNumber;
        address id_;
        address kycVerifiedBy; // Address of the organization only if KYC gets verified
        string dataHash; // Documents will be stored in decentralised storage & a hash will be created for the same
        uint256 dataUpdatedOn;
    }

    struct Organization {
        string name;
        string email;
        address id_;
        string ifscCode;
        uint16 kycCount; // How many KCY's did this organization completed so far
        OrganizationStatus status; // RBI, we call "admin" here can disable the organization at any instance
    }

    struct KycRequest {
        string id_; // Combination of customer Id & organization is going to be unique
        address userId_;
        string customerName;
        address organizationId_;
        string organizationName;
        string dataHash;
        uint256 updatedOn;
        KycStatus status;
        DataHashStatus dataRequest; // Get approval from user to access the data
        string additionalNotes; // Notes that can be added if KYC verification fails  OR
        // if customer rejects the access & organization wants to re-request with some message
    }
}
