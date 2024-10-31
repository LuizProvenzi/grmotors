type Entry = {
  name: string;
  addition: { label: string; value: string };
  value: number | string;
  date: string;
};

export const calculate = (
  entries: Entry[],
): { total: number; message: string } => {
  const total = entries
    .sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('-');
      const dateB = b.date.split('/').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    })
    .reduce((total, entry) => {
      const value =
        typeof entry.value === 'string' ? parseFloat(entry.value) : entry.value;
      return entry.addition.value === 'true' ? total + value : total - value;
    }, 0);

  const message = total >= 0 ? 'positive' : 'negative';

  return { total, message };
};

export const calculateGarage = (
  entries: { date: string; value: string; name: string }[],
): { total: number } => {
  const total = entries
    .sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('-');
      const dateB = b.date.split('/').reverse().join('-');
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    })
    .reduce((total, entry) => {
      const value = parseFloat(entry.value);
      return total + value;
    }, 0);

  return { total };
};
