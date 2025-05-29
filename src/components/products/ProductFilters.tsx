
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Locale } from '@/lib/i1n-config';
import type { Category, Product } from '@/lib/types';

interface ProductFiltersProps {
  dictionary: {
    filtersTitle: string;
    clearAllButton: string;
    categoryTitle: string;
    priceRangeTitle: string;
    scentTitle: string;
    materialTitle: string;
    applyFiltersButton?: string; // Optional, for mobile sheet
  };
  categoriesData: Category[];
  allProducts: Product[];
  onApplyFilters?: () => void; // Optional callback for mobile sheet
}

export function ProductFilters({ dictionary, categoriesData, allProducts, onApplyFilters }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const locale = routeParams.locale as Locale || 'uz';

  const initialCategories = useMemo(() => searchParams.getAll('category') || [], [searchParams]);
  const initialScents = useMemo(() => searchParams.getAll('scent') || [], [searchParams]);
  const initialMaterials = useMemo(() => searchParams.getAll('material') || [], [searchParams]);
  const initialMinPrice = useMemo(() => Number(searchParams.get('minPrice')) || 0, [searchParams]);
  const initialMaxPrice = useMemo(() => Number(searchParams.get('maxPrice')) || 200, [searchParams]);


  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedScents, setSelectedScents] = useState<string[]>(initialScents);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialMaterials);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  
  const [minPriceInput, setMinPriceInput] = useState(String(initialMinPrice));
  const [maxPriceInput, setMaxPriceInput] = useState(String(initialMaxPrice));

  // Update local state if searchParams change externally (e.g. browser back/forward)
  useEffect(() => {
    setSelectedCategories(searchParams.getAll('category') || []);
    setSelectedScents(searchParams.getAll('scent') || []);
    setSelectedMaterials(searchParams.getAll('material') || []);
    const min = Number(searchParams.get('minPrice')) || 0;
    const max = Number(searchParams.get('maxPrice')) || 200;
    setPriceRange([min, max]);
    setMinPriceInput(String(min));
    setMaxPriceInput(String(max));
  }, [searchParams]);


  const uniqueScents = useMemo(() => {
    const scents = allProducts
      .map(p => p.scent)
      .filter((s): s is string => typeof s === 'string' && s.trim() !== '');
    return Array.from(new Set(scents)).sort();
  }, [allProducts]);

  const uniqueMaterials = useMemo(() => {
    const materials = allProducts
      .map(p => p.material)
      .filter((m): m is string => typeof m === 'string' && m.trim() !== '');
    return Array.from(new Set(materials)).sort();
  }, [allProducts]);

  const applyFiltersToURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.delete('category');
    selectedCategories.forEach(cat => params.append('category', cat));

    params.delete('scent');
    selectedScents.forEach(scent => params.append('scent', scent));
    
    params.delete('material');
    selectedMaterials.forEach(mat => params.append('material', mat));

    if (priceRange[0] > 0) {
      params.set('minPrice', String(priceRange[0]));
    } else {
      params.delete('minPrice');
    }
    // Adjusted max price condition based on common usage
    if (priceRange[1] < 200 || (priceRange[1] === 200 && searchParams.has('maxPrice'))) { 
      params.set('maxPrice', String(priceRange[1]));
    } else {
      params.delete('maxPrice');
    }
    
    router.push(`/${locale}/products?${params.toString()}`, { scroll: false });
    if(onApplyFilters) {
        onApplyFilters(); // Close sheet if callback provided
    }
  }, [selectedCategories, selectedScents, selectedMaterials, priceRange, searchParams, router, locale, onApplyFilters]);

  // Auto-apply filters on desktop (if onApplyFilters is not provided)
  useEffect(() => {
    if (!onApplyFilters) { // Only auto-apply if it's not in a sheet controlled by a button
      applyFiltersToURL();
    }
  }, [selectedCategories, selectedScents, selectedMaterials, priceRange, onApplyFilters, applyFiltersToURL]);


  const handleCheckboxChange = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = list.includes(value)
      ? list.filter(item => item !== value)
      : [...list, value];
    setter(newList);
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = Number(value);
    if (type === 'min') {
      setMinPriceInput(value);
      if (!isNaN(numValue) && numValue >=0 && numValue <= priceRange[1]) {
        setPriceRange(current => [numValue, current[1]]);
      }
    } else {
      setMaxPriceInput(value);
      if (!isNaN(numValue) && numValue <= 200 && numValue >= priceRange[0]) {
         setPriceRange(current => [current[0], numValue]);
      }
    }
  };

  const handleSliderCommit = (newRange: [number, number]) => {
    setPriceRange(newRange);
    setMinPriceInput(String(newRange[0]));
    setMaxPriceInput(String(newRange[1]));
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedScents([]);
    setSelectedMaterials([]);
    setPriceRange([0, 200]);
    setMinPriceInput('0');
    setMaxPriceInput('200');
    // After clearing, apply to URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('scent');
    params.delete('material');
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`/${locale}/products?${params.toString()}`, { scroll: false });
     if(onApplyFilters) { // Also close sheet if it's open
        onApplyFilters();
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedScents.length > 0 || selectedMaterials.length > 0 || priceRange[0] > 0 || priceRange[1] < 200;

  return (
    // Removed bg-card as SheetContent has its own background
    <aside className="w-full space-y-4 p-4 lg:border lg:border-border/60 lg:rounded-lg lg:shadow-sm lg:bg-card">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{dictionary.filtersTitle}</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">
            <X className="mr-1 h-3 w-3" /> {dictionary.clearAllButton}
          </Button>
        )}
      </div>
      <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-base py-3">{dictionary.categoryTitle}</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {categoriesData.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.slug}-${onApplyFilters ? 'mobile' : 'desktop'}`} // Unique ID for mobile/desktop
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => handleCheckboxChange(category.slug, selectedCategories, setSelectedCategories)}
                />
                <Label htmlFor={`cat-${category.slug}-${onApplyFilters ? 'mobile' : 'desktop'}`} className="font-normal text-sm">{category.name}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-base py-3">{dictionary.priceRangeTitle}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-3">
            <Slider
              value={priceRange}
              min={0}
              max={200} // Assuming 200 is a reasonable max for mock data
              step={5}
              onValueCommit={handleSliderCommit}
              onValueChange={setPriceRange}
              className="my-2"
            />
            <div className="flex justify-between items-center space-x-2">
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">UZS</span>
                <Input 
                  type="number" 
                  value={minPriceInput}
                  onChange={(e) => handlePriceInputChange('min', e.target.value)}
                  className="w-full pl-10 h-9 text-sm" // Increased padding for UZS
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">UZS</span>
                <Input 
                  type="number" 
                  value={maxPriceInput}
                  onChange={(e) => handlePriceInputChange('max', e.target.value)}
                  className="w-full pl-10 h-9 text-sm" // Increased padding for UZS
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {uniqueScents.length > 0 && (
          <AccordionItem value="scent">
            <AccordionTrigger className="text-base py-3">{dictionary.scentTitle}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {uniqueScents.map(scent => (
                <div key={scent} className="flex items-center space-x-2">
                  <Checkbox
                    id={`scent-${scent.toLowerCase().replace(/\s+/g, '-')}-${onApplyFilters ? 'mobile' : 'desktop'}`}
                    checked={selectedScents.includes(scent)}
                    onCheckedChange={() => handleCheckboxChange(scent, selectedScents, setSelectedScents)}
                  />
                  <Label htmlFor={`scent-${scent.toLowerCase().replace(/\s+/g, '-')}-${onApplyFilters ? 'mobile' : 'desktop'}`} className="font-normal text-sm">{scent}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
        
        {uniqueMaterials.length > 0 && (
          <AccordionItem value="material">
            <AccordionTrigger className="text-base py-3">{dictionary.materialTitle}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {uniqueMaterials.map(material => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material.toLowerCase().replace(/\s+/g, '-')}-${onApplyFilters ? 'mobile' : 'desktop'}`}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() => handleCheckboxChange(material, selectedMaterials, setSelectedMaterials)}
                  />
                  <Label htmlFor={`material-${material.toLowerCase().replace(/\s+/g, '-')}-${onApplyFilters ? 'mobile' : 'desktop'}`} className="font-normal text-sm">{material}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      {onApplyFilters && (
        <Button onClick={applyFiltersToURL} className="w-full mt-4">
          {dictionary.applyFiltersButton || "Show Results"}
        </Button>
      )}
    </aside>
  );
}

    