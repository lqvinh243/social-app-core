const axios = require("axios");
const { CAPCHA_SECRET_KEY, CAPCHA_BASE_URL } = require("../../config");

async function siteVerify (response) {
  const body = `secret=${CAPCHA_SECRET_KEY}&response=${response}`;
  const result = await axios.post(`${CAPCHA_BASE_URL}/recaptcha/api/siteverify`, body, { headers: { "Conent-Type": "application/x-www-form-urlencoded" } });

  return result.data.success;
}

module.exports.siteVerify = siteVerify;
