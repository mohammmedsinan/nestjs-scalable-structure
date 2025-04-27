import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export default class GoogleBusinessService {
  async checkForBusinessAccount(accessToken: string) {
    try {
      // Create an OAuth2 client with the token
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      // Initialize the Business Profile API client
      const businessProfile = google.mybusinessbusinessinformation({
        version: 'v1',
        auth,
      });

      // List the user's locations (business accounts)
      const response = await businessProfile.accounts.locations.list();

      // If there are accounts, the user has a GMB profile
      if (response.data.locations && response.data.locations.length > 0) {
        return {
          hasBusinessAccount: true,
          accounts: response.data.locations.map((account) => ({
            gmb: account,
          })),
        };
      } else {
        return { hasBusinessAccount: false };
      }
    } catch (error) {
      console.error('Error checking for business account:', error);
      return { hasBusinessAccount: false, error: error.message };
    }
  }
}
