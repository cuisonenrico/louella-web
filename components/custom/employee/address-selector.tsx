"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { locationService, Province, City, Barangay } from "@/lib/services/location.service";

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  disabled?: boolean;
}

interface AddressComponents {
  province: string;
  city: string;
  barangay: string;
  street: string;
}

export function AddressSelector({ value, onChange, disabled = false }: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);

  // Memoize the address construction to prevent infinite loops
  const fullAddress = useMemo(() => {
    const addressParts = [
      streetAddress,
      selectedBarangay,
      selectedCity,
      selectedProvince
    ].filter(part => part.trim());

    return addressParts.join(', ');
  }, [streetAddress, selectedBarangay, selectedCity, selectedProvince]);

  // Update parent component when address changes (with proper dependency)
  useEffect(() => {
    if (fullAddress !== value) {
      onChange(fullAddress);
    }
  }, [fullAddress, value, onChange]);

  // Parse existing address value on mount only
  useEffect(() => {
    if (value && value.trim() && !selectedProvince && !selectedCity && !selectedBarangay && !streetAddress) {
      const parts = value.split(', ');
      if (parts.length >= 2) {
        setStreetAddress(parts[0] || "");
        setSelectedBarangay(parts[1] || "");
        setSelectedCity(parts[2] || "");
        setSelectedProvince(parts[3] || "");
      } else {
        setStreetAddress(value);
      }
    }
  }, []); // Only run on mount

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const data = await locationService.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      const loadCities = async () => {
        setIsLoadingCities(true);
        setCities([]);
        setBarangays([]);
        setSelectedCity("");
        setSelectedBarangay("");
        
        try {
          const province = provinces.find(p => p.name === selectedProvince);
          if (province) {
            const data = await locationService.getCitiesByProvince(province.code);
            setCities(data);
          }
        } catch (error) {
          console.error('Failed to load cities:', error);
        } finally {
          setIsLoadingCities(false);
        }
      };

      loadCities();
    } else {
      setCities([]);
      setBarangays([]);
      setSelectedCity("");
      setSelectedBarangay("");
    }
  }, [selectedProvince, provinces]);

  // Load barangays when city changes
  useEffect(() => {
    if (selectedCity) {
      const loadBarangays = async () => {
        setIsLoadingBarangays(true);
        setBarangays([]);
        setSelectedBarangay("");
        
        try {
          const city = cities.find(c => c.name === selectedCity);
          if (city) {
            const data = await locationService.getBarangaysByCity(city.code);
            setBarangays(data);
          }
        } catch (error) {
          console.error('Failed to load barangays:', error);
        } finally {
          setIsLoadingBarangays(false);
        }
      };

      loadBarangays();
    } else {
      setBarangays([]);
      setSelectedBarangay("");
    }
  }, [selectedCity, cities]);

  const clearAddress = () => {
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
    setStreetAddress("");
    setCities([]);
    setBarangays([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Address
        </Label>
        {(selectedProvince || selectedCity || selectedBarangay || streetAddress) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAddress}
            className="h-6 px-2 text-xs"
            disabled={disabled}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Province Selector */}
      <div className="space-y-2">
        <Label htmlFor="province" className="text-xs text-muted-foreground">
          Province
        </Label>
        <Select
          value={selectedProvince}
          onValueChange={setSelectedProvince}
          disabled={disabled || isLoadingProvinces}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              isLoadingProvinces ? "Loading provinces..." : "Select province"
            } />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province.code} value={province.name}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selector */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-xs text-muted-foreground">
          City/Municipality
        </Label>
        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
          disabled={disabled || !selectedProvince || isLoadingCities}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !selectedProvince 
                ? "Select province first"
                : isLoadingCities 
                ? "Loading cities..." 
                : "Select city/municipality"
            } />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.code} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Barangay Selector */}
      <div className="space-y-2">
        <Label htmlFor="barangay" className="text-xs text-muted-foreground">
          Barangay
        </Label>
        <Select
          value={selectedBarangay}
          onValueChange={setSelectedBarangay}
          disabled={disabled || !selectedCity || isLoadingBarangays}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !selectedCity
                ? "Select city first"
                : isLoadingBarangays
                ? "Loading barangays..."
                : "Select barangay"
            } />
          </SelectTrigger>
          <SelectContent>
            {barangays.map((barangay) => (
              <SelectItem key={barangay.code} value={barangay.name}>
                {barangay.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Street Address */}
      <div className="space-y-2">
        <Label htmlFor="street" className="text-xs text-muted-foreground">
          Street Address (Optional)
        </Label>
        <Input
          id="street"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder="House/Unit number, Street name"
          disabled={disabled}
        />
      </div>

      {/* Address Preview */}
      {(streetAddress || selectedBarangay || selectedCity || selectedProvince) && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <Label className="text-xs text-muted-foreground">Address Preview:</Label>
          <p className="text-sm mt-1">
            {fullAddress || 'No address selected'}
          </p>
        </div>
      )}
    </div>
  );
}
