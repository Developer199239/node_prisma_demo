import { fetchWebexData } from "../services/webexService.js";
import prisma from "../DB/db.config.js";
import { handleError } from "../utils/errorHandler.js";
import { validateExtension } from "../utils/validation.js";

// Sync Webex data manually
export const manualSyncWebexData = async (req, res) => {
  try {
    await fetchWebexData();
    res.json({ status: 200, message: "Webex data synced successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

// // Query extension data
// export const getExtensionData = async (req, res) => {
//   const { extension } = req.params;

//   try {
//     const phoneNumber = await prisma.webexPhoneNumber.findFirst({
//       where: { extension },
//     });

//     if (!phoneNumber) {
//       return res.status(404).json({ status: 404, message: "Extension not found" });
//     }

//     res.json({ status: 200, data: phoneNumber });
//   } catch (error) {
//     handleError(error, res);
//   }
// };

// Query extension data
export const getExtensionData = async (req, res) => {
  const { extension } = req.params;

  const { error } = validateExtension(extension);
  if (error) {
    return res.status(400).json({ status: 400, message: "Invalid extension format" });
  }

  try {
    const phoneNumber = await prisma.webexPhoneNumber.findFirst({
      where: { extension },
    });

    if (!phoneNumber) {
      return res.status(404).json({ status: 404, message: "Extension not found" });
    }

    res.json({ status: 200, data: phoneNumber });
  } catch (error) {
    handleError(error, res);
  }
};
