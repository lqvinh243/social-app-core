const axios = require("axios").default;
const { CAPCHA_SECRET_KEY, CAPCHA_BASE_URL } = require("../../config");
async function siteVerify (response) {
  const body = `secret=${CAPCHA_SECRET_KEY}&response=${response}`;
  const url = `${CAPCHA_BASE_URL}/recaptcha/api/siteverify`;
  const result = await axios.post(url, body, { headers: { "Conent-Type": "application/x-www-form-urlencoded" } });
  return result.data.success;
}

module.exports.siteVerify = siteVerify;
