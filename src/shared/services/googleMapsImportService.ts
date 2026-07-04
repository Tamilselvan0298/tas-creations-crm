export interface ParsedBusiness {
  name: string;
  phone?: string;
  website?: string;
  address?: string;
  category?: string;
  googleRating?: number;
  reviewCount?: number;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
}

class GoogleMapsImportService {
  parseImport(input: string): ParsedBusiness {
    const isUrl = input.startsWith('http://') || input.startsWith('https://');
    
    if (isUrl) {
      return this.parseMapsUrl(input);
    } else {
      return this.parseTextBlob(input);
    }
  }

  private parseMapsUrl(url: string): ParsedBusiness {
    const result: ParsedBusiness = {
      name: 'Imported Lead via URL',
      googleMapsUrl: url,
    };

    try {
      // 1. Try to extract name from place segment
      // Example: https://www.google.com/maps/place/Apex+Logistics/@32.776,-96.79,15z
      const placeMatch = url.match(/\/maps\/place\/([^/@]+)/);
      if (placeMatch && placeMatch[1]) {
        result.name = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      }

      // 2. Try to extract lat/lng coordinates
      const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordsMatch) {
        result.latitude = parseFloat(coordsMatch[1]);
        result.longitude = parseFloat(coordsMatch[2]);
      }
    } catch (e) {
      console.error('Failed to parse Maps URL:', e);
    }

    return result;
  }

  private parseTextBlob(text: string): ParsedBusiness {
    // Standard text copy-paste from Google Maps sidebar
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      throw new Error('Provided text is empty.');
    }

    // Usually first line is business name
    const result: ParsedBusiness = {
      name: lines[0] || 'Imported Text Lead',
    };

    // 1. Find rating (e.g. "4.5" or "4.5 (128)")
    const ratingMatch = text.match(/\b([1-5]\.\d)\b/);
    if (ratingMatch) {
      result.googleRating = parseFloat(ratingMatch[1]);
    }

    // 2. Find review count (e.g. "156 reviews" or "(156)" next to rating)
    const reviewsMatch = text.match(/\((\d{1,5})\)/) || text.match(/\b(\d{1,5})\s+reviews\b/);
    if (reviewsMatch) {
      result.reviewCount = parseInt(reviewsMatch[1], 10);
    }

    // 3. Find phone number
    const phoneMatch = text.match(/(\+?\d[\d-\s()]{7,}\d)/);
    if (phoneMatch) {
      result.phone = phoneMatch[1].trim();
    }

    // 4. Find website domain
    const websiteMatch = text.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,6})\b/);
    if (websiteMatch && !['google.com', 'maps.google'].includes(websiteMatch[1])) {
      result.website = websiteMatch[1].toLowerCase();
    }

    // 5. Try to guess address (usually a line containing street suffixes or city/state)
    const addressLine = lines.find(l => l.match(/\d+\s+[a-zA-Z0-9\s]+(St|Ave|Rd|Blvd|Dr|Way|Lane)/i));
    if (addressLine) {
      result.address = addressLine;
    }

    return result;
  }
}

export const googleMapsImportService = new GoogleMapsImportService();
export default googleMapsImportService;
