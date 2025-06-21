interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface PostMetadata {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  author: string;
  timestamp: string;
  imageUrl?: string;
}

export class PinataService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://api.pinata.cloud';

  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY || '';
    this.apiSecret = import.meta.env.VITE_PINATA_SECRET_API_KEY || '';
    
    if (!this.apiKey || !this.apiSecret) {
      console.warn('Pinata API credentials not found. Using mock service.');
    }
  }

  async pinPostMetadata(metadata: PostMetadata): Promise<string> {
    if (!this.apiKey || !this.apiSecret) {
      // Mock implementation for development
      return this.mockPinToIPFS(metadata);
    }

    try {
      const response = await fetch(`${this.baseUrl}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.apiSecret,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `post-${metadata.title.replace(/\s+/g, '-').toLowerCase()}`,
            keyvalues: {
              type: 'blog-post',
              author: metadata.author,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Pinata API error: ${response.statusText}`);
      }

      const result: PinataResponse = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('Error pinning to Pinata:', error);
      // Fallback to mock for development
      return this.mockPinToIPFS(metadata);
    }
  }

  async getPostMetadata(cid: string): Promise<PostMetadata | null> {
    if (!this.apiKey || !this.apiSecret) {
      // Mock implementation for development
      return this.mockGetFromIPFS(cid);
    }

    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching from Pinata:', error);
      return this.mockGetFromIPFS(cid);
    }
  }

  private mockPinToIPFS(metadata: PostMetadata): string {
    // Generate a mock CID for development
    const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    console.log('Mock Pinata: Pinned metadata with CID:', mockCid);
    return mockCid;
  }

  private mockGetFromIPFS(cid: string): PostMetadata | null {
    console.log('Mock Pinata: Fetching metadata for CID:', cid);
    // Return null for mock - in real implementation this would fetch from IPFS
    return null;
  }
}

export const pinataService = new PinataService();