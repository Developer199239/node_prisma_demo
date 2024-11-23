import axios from "axios";
import prisma from "../DB/db.config.js";

const ORGANIZATIONS_API_URL = "https://webexapis.com/v1/organizations";
const WEBEX_API_URL = "https://webexapis.com/v1/telephony/config/numbers";

/**
 * Fetches organizations from the Webex API.
 * @returns {Promise<Object>} Organization data
 */
export const fetchOrganizations = async () => {
  try {
    const response = await axios.get(ORGANIZATIONS_API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.WEBEX_API_TOKEN}`,
      },
    });

    console.log(`Fetched ${response.data.items.length} organizations.`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        `Failed to fetch organizations: ${error.response.status} - ${error.response.data.message || "Unknown error"}`
      );
    } else {
      console.error(`Failed to fetch organizations: ${error.message}`);
    }
    throw new Error("Error fetching organizations.");
  }
};

/**
 * Fetches Webex telephony data for a specific organization and saves it to the database.
 * @param {string} orgId - Organization ID
 */
export const fetchWebexData = async (orgId) => {
  try {
    const urlWithOrgId = `${WEBEX_API_URL}?orgId=${orgId}`;

    const response = await axios.get(urlWithOrgId, {
      headers: {
        Authorization: `Bearer ${process.env.WEBEX_API_TOKEN}`,
      },
    });

    const phoneNumbers = response.data.phoneNumbers || [];
    console.log(`Fetched ${phoneNumbers.length} phone numbers for organization ${orgId}.`);

    await prisma.$transaction(async (prisma) => {
      // Clear old data
      await prisma.webexPhoneNumber.deleteMany();

      // Save new data
      await prisma.webexPhoneNumber.createMany({
        data: phoneNumbers.map((item) => ({
          phoneNumber: item.phoneNumber,
          extension: item.extension,
          esn: item.esn,
          state: item.state,
          phoneNumberType: item.phoneNumberType,
          mainNumber: item.mainNumber,
          includedTelephonyTypes: item.includedTelephonyTypes,
          tollFreeNumber: item.tollFreeNumber,
          locationId: item.location?.id,
          locationName: item.location?.name,
          ownerId: item.owner?.id,
          ownerType: item.owner?.type,
          ownerFirstName: item.owner?.firstName,
          ownerLastName: item.owner?.lastName,
          isServiceNumber: item.isServiceNumber,
          orgId,
        })),
      });
    });

    console.log(`Webex data synced successfully for organization ${orgId}.`);
    return true;
  } catch (error) {
    if (error.response) {
      console.error(
        `Failed to sync Webex data for organization ${orgId}: ${error.response.status} - ${error.response.data.message || "Unknown error"}`
      );
    } else {
      console.error(`Failed to sync Webex data for organization ${orgId}: ${error.message}`);
    }
    throw new Error(`Error syncing Webex data for organization ${orgId}.`);
  }
};

/**
 * Fetches all organizations and processes Webex data for each.
 */
export const getOrganizationNumbers = async () => {
  try {
    const organizations = await fetchOrganizations();

    if (organizations.items && organizations.items.length > 0) {
      console.log(`Processing ${organizations.items.length} organizations...`);

      // Use Promise.all to fetch data for all organizations concurrently
      await Promise.all(
        organizations.items.map(async (item) => {
          const organizationId = item.id;
          await fetchWebexData(organizationId);
        })
      );

      console.log("All organizations processed successfully.");
    } else {
      console.log("No organizations found.");
    }
  } catch (error) {
    console.error(`Error processing organizations: ${error.message}`);
    throw error;
  }
};
