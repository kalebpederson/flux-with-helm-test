const { Octokit } = require("octokit");
const { createAppAuth } = require("@octokit/auth-app");

// GitHub App settings
const appId = "889487";
const privateKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAqxGwjXi9LiRKBR1rNmTVZQ+n+Qm7PNucZXpZ8Bhd1YUJO9uo\nEgI3dmPW7U9Uv38RmnDt9eXKbWxObtlsFKMt8/mgxgJFu8lvt3Z3qRtCa1pblNvt\nwv/iQ6Wu2tZwurMiE3H4HaR9QJbvnG1OSleGgH4IXyIxCZmMiK/a1saHQ7csBNhN\nXXh/lcGwggx1U+JH1m5ABOpS5FSUDmPeHIMRUpPJg+q7jUMVnnkjnKDvZnhhkIrQ\n/Zlvo+FKaMCP4TmNSyEnnRSJG3PcxNPFsHILpQV+kG46vXCRKfv/ylSuEokqtY7v\nZxW5U9V+iTFlv+feKnc2hTiKZSy4n9vfIlpYWwIDAQABAoIBAFQiVxq9Dw3qex0Y\n4unVnb4efRZWWugLelfOXP1gfoXM8EWoOnjg7jYj1EjSg3PLIvU6JU6SvYQjiE+s\nTyO3PZqIYzH/XByHbZJliWR6K6hwwCnuIHmPL9DlY6HtZXPtNg0qOEUb6R4jHaVp\nfN/DPDtlwOhJAKUgB6YSFycabNw4I/tYfvvGEwAO5RFyD6aiyLyz7IyRscF+lKKb\njFSLykMnVlazCCIScQ3cL1ls7rTnj7u0cvWFv0NngWbg4pFcv8YRmg9n8WsQXbuc\nVy3hR+C/OKhE3K/BiUESR1AdFLnstGVi4w3O8Et7db1UJlpf/SbxiFitmLIPP+Xg\nlBMho4ECgYEA34CSJI9DL/UbnMKLN6TaAWcplUYPE54WAe1xi+rMSipkf8XEpwgt\ncVjRXPgZPt08L+npyQGwTRu9Pnh9VDSt5OMsoAsTxQr9dwbSutNh05zleaubwnSF\naO681WN3xt66uwAp8fbouK2YENZ9+qe8CRKB+IazHM3p43OJLFvWIlMCgYEAw/Fm\nKithWoHxtjcoBeQBOiz1rXlLeI/Buxoleop6PAOjC31kKthdOccbYEy/iiTLDp1h\n8n34WKh9+uw90h4IP9yJ+RtsNFB++Aqt+W+lG/6qNL41vhPw3h+0xh4jlX+pNzSb\nHzxP1lAdRJTzDjYsygvVGM5f7dDkRUeDm65jwNkCgYARQZgHApipZz9OhybAkRXT\n7eckA1i+pwID/BU8PFCxmTxRMS/RxavciIMBrpYkaGhxOpo2Ts8R5QZjgGIM0lRq\ny69yW+iW2hZfzkMO8asn74E4N6u7A8wZIfWqdBeXXzMDpSuX5vxo5d5LzoPDipfW\nC3vFeIDzxGI+kXkR17VcyQKBgGVIXprlmYkDKkIZ+KIy3T+JBeUJka1cAbQJK95P\nvidPafQCeMh81pOLC+eXRFrP8fY3++0wmDKbxaLygnId+/2mrdsKBcB062yjeJI6\n14nE9Y4V1AnQnOz0Tqkp4xLfzkQu+RAISOxqtPZCV/C8qCI4Q4pzArsXAyecc7cB\nSabhAoGAZCW/rH3yKX0mTDxrYec9chyIGTvVJmKhd/j8grs+DXxgFDtYFOpPbL9s\ncD4v6+iQt2vz9tHo6nA57mYKYFwK1McVr4xGiC8GPxBaOw/cEdBwPOagTjdoUT7J\nPS7oI6dVfGD3tVPqJRAhtq4R66FaOg8K0yR4r4vJB/svHdzBo10=\n-----END RSA PRIVATE KEY-----\n"; // Replace with your GitHub App's private key

// Create an instance of the Octokit client with GitHub App authentication
const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: appId,
    privateKey: privateKey,
    installationId: "50269669"
  }
});

// Function to generate JWT token
async function generateJwtToken() {
  const appAuth = createAppAuth({
    appId: appId,
    privateKey: privateKey,
    installationId: "50269669"
  });
  const { token } = await appAuth({ type: "app" });
  return token;
}

// Function to create a check run
async function createCheckRun(owner, repo, commitSHA) {
  try {
    // Generate JWT token
    const jwtToken = await generateJwtToken();

    // Create an authenticated instance of the Octokit client with JWT token
    const authenticatedOctokit = new Octokit({
      auth: jwtToken
    });

    const input = {
      owner: owner,
      repo: repo,
      name: "Sample Check", // Name of the check run
      head_sha: commitSHA, // Commit SHA for which the check run is created
      status: "completed", // Status of the check run
      conclusion: "success", // Conclusion of the check run
      output: {
        title: "Sample Check Results", // Title of the check run output
        summary: "All checks passed successfully.", // Summary of the check run output
        text: "This is some additional information about the check results." // Additional information
      }
    };
    console.log(input);
    console.log("auth");
    console.log(authenticatedOctokit);
    console.log("checks");
    console.log(authenticatedOctokit.checks);

    // Make the API request to create the check run
    const response = await authenticatedOctokit.rest.checks.create(input);

    console.log("Check run created successfully:", response.data);
  } catch (error) {
    console.error("Error creating check run:", error);
  }
}

// Example usage: Create a check run for a specific repository and commit
createCheckRun("kalebpederson", "flux-with-helm-test", "44db4a84b01bfb34f67c72ef471e41efb1bb3dc6");

