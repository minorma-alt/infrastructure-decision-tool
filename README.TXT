INFRASTRUCTURE DECISION TOOL
Author: Marcel Minor
Course: INFO 300

DESCRIPTION
This Node.js program has two tools:
  1. Subnet Host Checker - checks whether a subnet CIDR fits inside a VPC CIDR
     and whether it has enough IP addresses for the devices needed
     (AWS reserves 5 IPs in every subnet).
  2. Compute Environment Selector - recommends an AWS compute setup based on
     monthly users, budget, and whether high availability is needed.

HOW TO RUN
  1. Install Node.js
  2. Open a terminal in this folder
  3. Run:  npm install
  4. Run:  node app.js

------------------------------------------------------------
EXAMPLE 1: SUBNET IS SUFFICIENT
------------------------------------------------------------
Enter 1 or 2: 1

--- Subnet Host Checker ---
Enter the VPC CIDR (e.g., /24): /16
Enter the Subnet CIDR (e.g., /24): /24
Enter the number of devices required: 200

--- Results ---
CIDR check: /24 is consistent with the VPC /16.
Total IPs in subnet: 256
Usable IPs (after AWS reserves 5): 251
Devices required: 200
Capacity check: The subnet IS sufficient.
Unused IP addresses: 51

Math: 2^(32-24) = 256 total IPs. 256 - 5 reserved = 251 usable.
251 - 200 devices = 51 unused.

------------------------------------------------------------
EXAMPLE 2: SUBNET IS NOT SUFFICIENT
------------------------------------------------------------
Enter 1 or 2: 1

--- Subnet Host Checker ---
Enter the VPC CIDR (e.g., /24): /16
Enter the Subnet CIDR (e.g., /24): /28
Enter the number of devices required: 20

--- Results ---
CIDR check: /28 is consistent with the VPC /16.
Total IPs in subnet: 16
Usable IPs (after AWS reserves 5): 11
Devices required: 20
Capacity check: The subnet is NOT sufficient.
Additional IP addresses needed: 9

Math: 2^(32-28) = 16 total IPs. 16 - 5 reserved = 11 usable.
20 devices - 11 usable = 9 more IPs needed.
