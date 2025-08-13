// src/nhost.js

import { NhostClient } from '@nhost/react';

// NhostClient ko configure karein
const nhost = new NhostClient({
  subdomain: 'bisvcatrrmemfwvskwkf', // !! Yahan apna Nhost Subdomain daalein !!
  region: 'ap-south-1'      // !! Yahan apna Nhost Region daalein !!
});

// Client ko export karein taaki doosri files use kar sakein
export { nhost };