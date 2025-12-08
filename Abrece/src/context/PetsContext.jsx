import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PetServices } from '../services/PetServices';

const PetsContext = createContext();

export const usePets = () => {
  const context = useContext(PetsContext);
  if (!context) {
    throw new Error('usePets deve ser usado dentro de PetsProvider');
  }
  return context;
};

export const PetsProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Cache por 5 minutos
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchPets = async (forceRefresh = false) => {
    // Verificar cache
    if (!forceRefresh && lastUpdate && Date.now() - lastUpdate < CACHE_DURATION) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await PetServices.getAllPets();
      if (response.success && response.data?.data) {
        const petsFormatados = response.data.data
          .filter((pet) => pet.status !== "adotado") // Remover adotados globalmente
          .map((pet) => ({
            id: pet.id,
            nome: pet.nome,
            tipo: pet.tipo,
            idade: pet.idade,
            porte: pet.porte,
            sexo: pet.sexo,
            cor: pet.cor,
            peso: pet.peso,
            descricao: pet.descricao,
            castrado: pet.castrado,
            vacinado: pet.vacinado,
            vermifugado: pet.vermifugado,
            localizacao: pet.localizacao,
            status: pet.status,
            imagens: pet.imagens?.map((img) => img.url_imagem) || [],
            imagem: pet.imagens?.[0]?.url_imagem || null,
          }));
        
        setPets(petsFormatados);
        setLastUpdate(Date.now());
        console.log('🔄 Pets atualizados no contexto:', petsFormatados.length);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar pets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Memoized computed values para evitar recálculos
  const petsStats = useMemo(() => ({
    total: pets.length,
    disponivel: pets.filter(pet => pet.status === 'disponivel').length,
    em_processo: pets.filter(pet => pet.status === 'em_processo').length,
    fortaleza: pets.filter(pet => 
      pet.localizacao?.toLowerCase().includes('fortaleza')
    ).length,
    aquiraz: pets.filter(pet => 
      pet.localizacao?.toLowerCase().includes('aquiraz')
    ).length,
  }), [pets]);

  const petsDisponiveis = useMemo(() => 
    pets.filter(pet => pet.status === 'disponivel'),
    [pets]
  );

  const value = {
    pets,
    petsDisponiveis,
    petsStats,
    loading,
    error,
    fetchPets,
    refreshPets: () => fetchPets(true),
  };

  return (
    <PetsContext.Provider value={value}>
      {children}
    </PetsContext.Provider>
  );
};