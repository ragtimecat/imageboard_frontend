import { useEffect, useState } from 'react';
import ThreadPreview from './ThreadPreview';
import { Link } from 'react-router-dom';
import APIService from '../services/APIService';

const Board = (params) => {
  const [board, setBoard] = useState({});
  const [threads, setThreads] = useState([]);

  const apiService = new APIService();
  const board_id = params.match.params.board_id;

  useEffect(() => {
    const fetchBoardInfo = async () => {
      const boardInfo = await apiService.getBoardById(board_id);
      console.log(boardInfo);
      if (boardInfo.success) {
        setBoard(boardInfo.data);
        const threadsInfo = await apiService.getThreadsByBoardId(board_id);
        setThreads(threadsInfo.data);
      } else {
        setBoard({name: 'NotFound', description: 'There is no board'});
      }
    }
    fetchBoardInfo();
  }, [params]);

  const onThreadDelete = async (id) => {
    console.log(id); 
    const result = await fetch(`http://localhost:5000/api/v1/threads/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const response = await result.json();

    if (response.success) {
      const newThreads = threads.filter(thread => thread._id !== id);
      setThreads(threads => newThreads);
    }
  }

  return (
    <div>
      <Link to={`${params.match.params.board_id}/create-thread`}>Create Thread</Link>

      <p>{board.name}</p>
      
      <p>description: {board.description}</p>
      {threads.length > 0 ? (
        threads.map(thread => <ThreadPreview onThreadDelete={onThreadDelete} title={thread.title} board_id={thread.board} thread_id={thread._id} key={thread._id} />)
        // threads.map(thread => <ThreadPreview title={thread.title} board_id={thread.board} thread_id={thread._id} key={thread._id} />)
      ) : <p>No threads</p>}
    </div>
  )
}

export default Board;
