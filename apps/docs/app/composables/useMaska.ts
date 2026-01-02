import type { MaskInputOptions } from 'maska';

export type MaskaType = 'money:2' | 'money:4' | 'cep' | 'cpf' | 'cnpj' | 'cpf_cnpj' | 'text' | 'string' | 'number';

interface MaskaConfig {
  getMaskaConfig: (type: MaskaType) => MaskInputOptions | undefined;
  formatValue: (value: unknown, type: string) => string;
  parseValue: (value: string, type: string) => unknown;
}

export function useMaska(): MaskaConfig {
  /**
   * Returns maska configuration for a specific input type
   */
  function getMaskaConfig(type: MaskaType): MaskInputOptions | undefined {
    switch (type) {
      case 'money:2':
        return {
          mask: '9,99',
          tokens: {
            9: { pattern: /\d/, repeated: true },
          },
          reversed: true,
        };

      case 'money:4':
        return {
          mask: '9,9999',
          tokens: {
            9: { pattern: /\d/, repeated: true },
          },
          reversed: true,
        };

      case 'cep':
        return {
          mask: '#####-###',
        };

      case 'cpf':
        return {
          mask: '###.###.###-##',
        };

      case 'cnpj':
        return {
          mask: '##.###.###/####-##',
        };

      case 'cpf_cnpj':
        return {
          mask: (value: string) => {
            const digits = value.replace(/\D/g, '');
            if (digits.length <= 11) {
              return '###.###.###-##';
            }
            return '##.###.###/####-##';
          },
        };

      default:
        return undefined;
    }
  }

  /**
   * Formats a value for display based on the input type
   */
  function formatValue(value: unknown, type: string): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (type.startsWith('money:')) {
      const decimals = parseInt(type.split(':')[1] ?? '2', 10);
      const num = typeof value === 'number' ? value : parseFloat(String(value));

      if (Number.isNaN(num)) return '';

      return num.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }

    if (type === 'cep') {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length === 8) {
        return `${digits.slice(0, 5)}-${digits.slice(5)}`;
      }
      return String(value);
    }

    if (type === 'cpf') {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length === 11) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
      }
      return String(value);
    }

    if (type === 'cnpj') {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length === 14) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
      }
      return String(value);
    }

    if (type === 'cpf_cnpj') {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length === 11) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
      }
      if (digits.length === 14) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
      }
      return String(value);
    }

    return String(value);
  }

  /**
   * Parses a formatted value back to its raw form
   */
  function parseValue(value: string, type: string): unknown {
    if (value === '' || value === null || value === undefined) {
      return null;
    }

    if (type.startsWith('money:')) {
      // Remove all non-numeric characters except comma
      const cleaned = value.replace(/[^\d,]/g, '');
      // Replace comma with dot for parsing
      const normalized = cleaned.replace(',', '.');
      const parsed = parseFloat(normalized);
      return Number.isNaN(parsed) ? null : parsed;
    }

    if (type === 'cep' || type === 'cpf' || type === 'cnpj' || type === 'cpf_cnpj') {
      // Return only digits
      return value.replace(/\D/g, '');
    }

    return value;
  }

  return {
    getMaskaConfig,
    formatValue,
    parseValue,
  };
}
