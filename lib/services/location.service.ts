export interface Province {
  code: string;
  name: string;
  regionCode: string;
}

export interface City {
  code: string;
  name: string;
  provinceCode: string;
}

export interface Barangay {
  code: string;
  name: string;
  cityCode: string;
}

class LocationService {
  private baseUrl = 'https://psgc.gitlab.io/api';

  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces/`);
      if (!response.ok) throw new Error('Failed to fetch provinces');
      const data = await response.json();
      return data.sort((a: Province, b: Province) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching provinces:', error);
      // Fallback to major provinces if API fails
      return this.getFallbackProvinces();
    }
  }

  async getCitiesByProvince(provinceCode: string): Promise<City[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces/${provinceCode}/cities-municipalities/`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      return data.sort((a: City, b: City) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  async getBarangaysByCity(cityCode: string): Promise<Barangay[]> {
    try {
      const response = await fetch(`${this.baseUrl}/cities-municipalities/${cityCode}/barangays/`);
      if (!response.ok) throw new Error('Failed to fetch barangays');
      const data = await response.json();
      return data.sort((a: Barangay, b: Barangay) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching barangays:', error);
      return [];
    }
  }

  private getFallbackProvinces(): Province[] {
    return [
      { code: "1371", name: "Metro Manila", regionCode: "13" },
      { code: "0421", name: "Rizal", regionCode: "04" },
      { code: "0434", name: "Cavite", regionCode: "04" },
      { code: "0456", name: "Laguna", regionCode: "04" },
      { code: "0469", name: "Batangas", regionCode: "04" },
      { code: "1041", name: "Bulacan", regionCode: "03" },
      { code: "1072", name: "Pampanga", regionCode: "03" },
      { code: "1701", name: "Cebu", regionCode: "07" },
      { code: "1038", name: "Davao del Sur", regionCode: "11" },
    ].sort((a, b) => a.name.localeCompare(b.name));
  }
}

export const locationService = new LocationService();
