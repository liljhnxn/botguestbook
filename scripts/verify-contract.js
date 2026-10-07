const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function verify() {
  const contractAddress = process.env.NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS || "0x750EB02E1dEd428abe0f7F0FbEbeD80ec6DC8bB5";
  console.log(`Starting contract verification for: ${contractAddress}`);

  const sourcePath = path.join(__dirname, "../contracts/BotGuestbook.sol");
  const sourceCode = fs.readFileSync(sourcePath, "utf8");

  const payload = {
    module: "contract",
    action: "verifysourcecode",
    contractaddress: contractAddress,
    sourceCode: sourceCode,
    codeformat: "solidity-single-file",
    contractname: "BotGuestbook",
    compilerversion: "v0.8.24+commit.e11b9ed9",
    optimizationUsed: "1",
    runs: "200",
    evmversion: "paris",
    licenseType: "3", // MIT
  };

  // Write payload to temp json
  const tempPayloadPath = path.join(__dirname, "temp-verify.json");
  
  // Format as URL encoded form data
  const formBody = Object.keys(payload)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]))
    .join("&");
  
  fs.writeFileSync(tempPayloadPath, formBody, "utf8");

  console.log("Submitting verification to https://scan.bohr.life/api via curl...");
  try {
    const curlCommand = `curl.exe -s -X POST "https://scan.bohr.life/api" --data-binary "@${tempPayloadPath}" -H "Content-Type: application/x-www-form-urlencoded"`;
    const response = execSync(curlCommand, { encoding: "utf8" });
    console.log("Response:", response);

    try {
      const parsed = JSON.parse(response);
      if (parsed.status === "1" || parsed.message === "OK") {
        console.log(`Verification submission successful! GUID / Result: ${parsed.result}`);
        
        // Poll status if GUID returned
        if (parsed.result && parsed.result.length > 5) {
          const guid = parsed.result;
          console.log(`Checking verification status for GUID: ${guid}...`);
          for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const checkCmd = `curl.exe -s "https://scan.bohr.life/api?module=contract&action=checkverifystatus&guid=${guid}"`;
            const checkRes = execSync(checkCmd, { encoding: "utf8" });
            console.log(`Poll [${i + 1}]:`, checkRes);
            if (checkRes.includes("Pass") || checkRes.includes("Success")) {
              console.log("Contract verified successfully!");
              break;
            }
          }
        }
      } else {
        console.log("Verification response message:", parsed.message || parsed.result);
      }
    } catch (e) {
      console.log("Raw output received:", response);
    }
  } finally {
    if (fs.existsSync(tempPayloadPath)) {
      fs.unlinkSync(tempPayloadPath);
    }
  }
}

verify().catch(console.error);
