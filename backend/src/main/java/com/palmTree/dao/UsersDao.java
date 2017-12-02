package com.palmTree.dao;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.palmTree.models.Users;


@Transactional
@Repository
public interface UsersDao extends CrudRepository<Users, Integer>
{
	public List<Users> findAll();
	
 	public Users findByUid(String userID);
 	public Users findByUser(String user);

}
