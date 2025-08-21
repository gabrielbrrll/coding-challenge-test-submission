import type { NextApiRequest, NextApiResponse } from "next";

import { validateGetAddressesQuery } from "../../src/utils/validators";
import { findAddresses } from "../../src/services/addressService";

/**
 * Clean API handler that coordinates validation and business logic
 * Each responsibility is separated into dedicated modules
 */
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Step 1: Validate the request query parameters
  const validationError = validateGetAddressesQuery(req.query);
  if (validationError) {
    return res.status(400).send(validationError);
  }

  // Extract validated parameters (we know they exist and are strings after validation)
  const { postcode, streetnumber } = req.query;
  const postcodeStr = Array.isArray(postcode) ? postcode[0] : postcode;
  const streetnumberStr = Array.isArray(streetnumber) ? streetnumber[0] : streetnumber;

  try {
    // Step 2: Call the business logic service
    const addresses = await findAddresses(postcodeStr!, streetnumberStr!);

    // Step 3: Handle the response based on service result
    if (addresses) {
      return res.status(200).json({
        status: "ok",
        details: addresses,
      });
    } else {
      return res.status(404).json({
        status: "error",
        // DO NOT MODIFY MSG - used for grading
        errormessage: "No results found!",
      });
    }
  } catch (error) {
    // Step 4: Handle any unexpected errors
    console.error("Error in address search:", error);
    return res.status(500).json({
      status: "error",
      errormessage: "Internal server error occurred while searching addresses",
    });
  }
}
