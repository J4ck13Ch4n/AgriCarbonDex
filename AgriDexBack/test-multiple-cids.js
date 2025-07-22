// Test script để demonstrate multiple CIDs functionality
// Bạn có thể copy logic này vào List.jsx để test

// Test case 1: Comma-separated CIDs
const testCID1 = "QmR6hc6Lwys8dkkt6Rnu1U85hNeDLp2XSftoBVTAZaFzSX,QmABC123,QmDEF456";

// Test case 2: Array CIDs  
const testCID2 = [
    "QmR6hc6Lwys8dkkt6Rnu1U85hNeDLp2XSftoBVTAZaFzSX",
    "QmABC123DefGhi789",
    "QmXYZ789MnoP012"
];

// Test parseCIDData function
function parseCIDData(cidData) {
    if (!cidData || cidData === 'N/A') {
        return { cid: 'N/A', cids: [] };
    }

    // If it's already an array
    if (Array.isArray(cidData)) {
        const validCids = cidData.filter(cid => cid && cid !== 'N/A' && cid.trim() !== '');
        if (validCids.length === 0) {
            return { cid: 'N/A', cids: [] };
        }
        return {
            cid: validCids[0], // For backward compatibility
            cids: validCids
        };
    }

    // If it's a string, check if it contains multiple CIDs separated by comma or semicolon
    const cidString = cidData.toString().trim();
    if (cidString.includes(',') || cidString.includes(';')) {
        const separator = cidString.includes(',') ? ',' : ';';
        const cidArray = cidString.split(separator)
            .map(cid => cid.trim())
            .filter(cid => cid && cid !== 'N/A');

        if (cidArray.length === 0) {
            return { cid: 'N/A', cids: [] };
        }

        return {
            cid: cidArray[0], // For backward compatibility
            cids: cidArray
        };
    }

    // Single CID
    return {
        cid: cidString,
        cids: [cidString]
    };
}

// Test results
console.log("Test 1 - Comma-separated:", parseCIDData(testCID1));
console.log("Test 2 - Array:", parseCIDData(testCID2));

/* Expected results:
Test 1 - Comma-separated: {
  cid: "QmR6hc6Lwys8dkkt6Rnu1U85hNeDLp2XSftoBVTAZaFzSX",
  cids: ["QmR6hc6Lwys8dkkt6Rnu1U85hNeDLp2XSftoBVTAZaFzSX", "QmABC123", "QmDEF456"]
}

Test 2 - Array: {
  cid: "QmR6hc6Lwys8dkkt6Rnu1U85hNeDLp2XSftoBVTAZaFzSX",
  cids: ["QmR6hc6Lwys8dkkt6Rnu1U85hNeDLp2XSftoBVTAZaFzSX", "QmABC123DefGhi789", "QmXYZ789MnoP012"]
}
*/
