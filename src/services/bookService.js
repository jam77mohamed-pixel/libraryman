import axiosClient from '../api/axiosClient';
import { INITIAL_BOOKS } from '../data/initialData';
import { getStorageItem, setStorageItem } from '../utils/storage';

// Bumped storage key so that old cached product images from first test are cleared!
const BOOKS_STORAGE_KEY = 'library_books_v3';
const DELETED_BOOKS_KEY = 'library_deleted_books_v3';

// Official OpenLibrary ISBN cover URLs for famous literary & academic titles
const CURATED_BOOK_COVERS = [
  'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', // Clean Code
  'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg', // Designing Data Intensive Apps
  'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg', // To Kill a Mockingbird
  'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', // Atomic Habits
  'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg', // Pragmatic Programmer
  'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg', // Sapiens
  'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg', // Zero to One
  'https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg', // Cosmos
  'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', // Thinking Fast and Slow
  'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg', // The Great Gatsby
  'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', // 1984
  'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg', // Pride and Prejudice
  'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg', // The Lord of the Rings
  'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg', // One Hundred Years of Solitude
  'https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg', // The Hobbit
];

const BOOK_TITLES_AND_AUTHORS = [
  { title: 'The Art of Computer Programming', author: 'Donald E. Knuth', publisher: 'Addison-Wesley', cat: 'Computer Science & Tech' },
  { title: 'The Structure of Scientific Revolutions', author: 'Thomas S. Kuhn', publisher: 'University of Chicago Press', cat: 'Science & Nature' },
  { title: '1984 & Animal Farm', author: 'George Orwell', publisher: 'Secker & Warburg', cat: 'Fiction & Literature' },
  { title: 'Thinking in Systems: A Primer', author: 'Donella H. Meadows', publisher: 'Chelsea Green Publishing', cat: 'Philosophy & Psychology' },
  { title: 'The Innovator\'s Dilemma', author: 'Clayton M. Christensen', publisher: 'Harvard Business Review Press', cat: 'Business & Leadership' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', publisher: 'Bantam Books', cat: 'Science & Nature' },
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', publisher: 'W. W. Norton', cat: 'History & Biography' },
  { title: 'Meditations: A New Translation', author: 'Marcus Aurelius', publisher: 'Modern Library', cat: 'Philosophy & Psychology' },
  { title: 'The Design of Everyday Things', author: 'Don Norman', publisher: 'Basic Books', cat: 'Computer Science & Tech' },
  { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', publisher: 'Harper & Row', cat: 'Fiction & Literature' },
  { title: 'Good to Great: Why Some Companies Leap', author: 'Jim Collins', publisher: 'HarperBusiness', cat: 'Business & Leadership' },
  { title: 'Silent Spring', author: 'Rachel Carson', publisher: 'Houghton Mifflin', cat: 'Science & Nature' },
  { title: 'The Lean Startup', author: 'Eric Ries', publisher: 'Crown Business', cat: 'Business & Leadership' },
  { title: 'Man\'s Search for Meaning', author: 'Viktor E. Frankl', publisher: 'Beacon Press', cat: 'Philosophy & Psychology' },
  { title: 'The Odyssey: A New Translation', author: 'Homer (Trans. Emily Wilson)', publisher: 'W. W. Norton', cat: 'Fiction & Literature' },
];

const mapDummyJsonToBook = (item, index) => {
  const meta = BOOK_TITLES_AND_AUTHORS[index % BOOK_TITLES_AND_AUTHORS.length];
  const cover = CURATED_BOOK_COVERS[index % CURATED_BOOK_COVERS.length];
  const total = Math.max(4, ((item.id * 3) % 10) + 3);
  const available = Math.max(1, total - (item.id % 3));

  return {
    id: `b-ext-${item.id}`,
    apiId: item.id,
    title: meta.title,
    author: meta.author,
    isbn: `978-0-${item.id * 17 + 101}-${item.id * 43 + 1007}-2`,
    publisher: meta.publisher,
    category: meta.cat,
    publishedYear: 2012 + (item.id % 12),
    totalCopies: total,
    availableCopies: available,
    coverImage: cover,
    description: item.description || 'A timeless library classic examining foundational ideas and inspiring generations of readers.',
    isExternal: true,
    createdAt: new Date(Date.now() - (item.id * 86400000)).toISOString(),
  };
};

export const bookService = {
  async getBooks() {
    const localSaved = getStorageItem(BOOKS_STORAGE_KEY, null);
    const deletedIds = new Set(getStorageItem(DELETED_BOOKS_KEY, []));

    if (localSaved && localSaved.length > 0) {
      return localSaved.filter((b) => !deletedIds.has(b.id));
    }

    try {
      // Real Network request to DummyJSON
      const response = await axiosClient.get('/products?limit=15&select=id,title,description,category,brand,stock');
      let apiBooks = [];
      if (response.data && Array.isArray(response.data.products)) {
        apiBooks = response.data.products.map((item, idx) => mapDummyJsonToBook(item, idx));
      }

      const combined = [...INITIAL_BOOKS, ...apiBooks].filter((b) => !deletedIds.has(b.id));
      setStorageItem(BOOKS_STORAGE_KEY, combined);
      return combined;
    } catch (error) {
      console.warn('Network catalog load fallback to local library shelf:', error);
      const fallback = INITIAL_BOOKS.filter((b) => !deletedIds.has(b.id));
      setStorageItem(BOOKS_STORAGE_KEY, fallback);
      return fallback;
    }
  },

  async addBook(bookData) {
    let dummyRes = null;
    try {
      dummyRes = await axiosClient.post('/products/add', {
        title: bookData.title,
        description: bookData.description,
        category: bookData.category,
        brand: bookData.author,
      });
    } catch (err) {
      // Local fallback
    }

    const newBook = {
      ...bookData,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString(),
      apiResponseId: dummyRes?.data?.id,
    };

    const currentBooks = getStorageItem(BOOKS_STORAGE_KEY, INITIAL_BOOKS);
    const updated = [newBook, ...currentBooks];
    setStorageItem(BOOKS_STORAGE_KEY, updated);
    return newBook;
  },

  async updateBook(id, bookData) {
    try {
      if (bookData.apiId) {
        await axiosClient.put(`/products/${bookData.apiId}`, {
          title: bookData.title,
          description: bookData.description,
        });
      }
    } catch (err) {
      // Local fallback
    }

    const currentBooks = getStorageItem(BOOKS_STORAGE_KEY, INITIAL_BOOKS);
    const updated = currentBooks.map((b) => (b.id === id ? { ...b, ...bookData } : b));
    setStorageItem(BOOKS_STORAGE_KEY, updated);
    return updated.find((b) => b.id === id);
  },

  async deleteBook(id, apiId = null) {
    try {
      if (apiId) {
        await axiosClient.delete(`/products/${apiId}`);
      }
    } catch (err) {
      // Local fallback
    }

    const deletedIds = getStorageItem(DELETED_BOOKS_KEY, []);
    setStorageItem(DELETED_BOOKS_KEY, [...deletedIds, id]);

    const currentBooks = getStorageItem(BOOKS_STORAGE_KEY, INITIAL_BOOKS);
    const updated = currentBooks.filter((b) => b.id !== id);
    setStorageItem(BOOKS_STORAGE_KEY, updated);
    return true;
  },
};
