import { IRepository } from './repository';

export interface IFloatingActionButtonProps {
  onPress: () => void;
}

export interface ISearchBarProps {
  onSearch: (query: string) => void;
  onSelectSuggestion: (repository: IRepository) => void;
  onClear: () => void;
  suggestions: IRepository[];
  loading: boolean;
  placeholder?: string;
  onSubmitSearch: (query: string) => void;
}

export type TSortOrder = 'ASC' | 'DESC';

export interface ISortFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onSort: (order: TSortOrder) => void;
  currentOrder: TSortOrder;
}
