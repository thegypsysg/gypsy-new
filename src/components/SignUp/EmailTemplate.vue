<template>
  <div>
    <div v-html="htmlContent"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      htmlContent: `
      <html>
  <body>
    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f5f5f5;  padding-top: 100px"
    >
      <!-- Header -->
      <tr>
        <td
          style="
            background-color: #f6f8fa;
            padding: 20px;
            display: flex;
            align-items: center;
          "
        >
          <img
            src="https://admin1.the-gypsy.sg/img/app/5a1d08542b8d76309ef8a9cce7b748d2.JPG"
            alt="Logo Perusahaan"
            style="max-width: 200px"
          />
          <h1 style="margin-left: 30px;">YOUR OTP</h1>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="background-color: #ffffff; padding: 20px; font-weight: 600;">
          <div style="width: 70%;">
          <p>Hi</p>
          <p>Please enter this OTP ;</p>
          <br />
          <h2>1234</h2>
          <br />
          <!-- <h2>{{ otpCode }}</h2> -->
          <p>
            To Help is confirm your identity on The Gypsy. We need to Verify
            your email address. Please enter this code to complete your
            verification process.
          </p>
          <br />
          <p>
            If you did not request this OTP then please change your email
            password.
          </p>
          <br />
          <p>Thanks!!!</p>
          <p>The Gypsy Security Team</p>
        </div>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background-color: #ffffff; padding: 20px">
          <hr />
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <p>
              This message was sent to
              <a style="text-decoration: none;" href="">chalrtonmendes@gmail.com</a> at your request.
            </p>
            <!-- <p>This message was sent to <a href="#">{{email}}</a> at your request. </p> -->
            <img
              src="https://admin1.the-gypsy.sg/img/app/5a1d08542b8d76309ef8a9cce7b748d2.JPG"
              alt="Logo Perusahaan"
              style="max-width: 100px"
            />
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>

      `, // Gantilah dengan path file HTML Anda
    };
  },
};
</script>
