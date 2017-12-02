package com.palmTree.models;

import java.util.ArrayList;
import java.util.Collection;



import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
//import javax.persistence.FetchType;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

//import org.hibernate.annotations.CollectionId;
//import org.hibernate.annotations.GenericGenerator;
//import org.hibernate.annotations.Type;

@Entity
@Table(name = "users")
public class Users
{
	@Id // primary key
    @NotNull 
	private String uid;
	private String user;
	private Bio bio;
	
	@ElementCollection//(fetch = FetchType.EAGER) changes from lazy fetch(default)
	@JoinTable(name = "user_paintings" )
	private Collection<Paintings> listOfPaintings = new ArrayList<Paintings>();
	



	//Constructors 
	public Users(String uid, String user)
	{
		this.uid = uid;
		this.user = user;
	}
	public Users() {}


	
	
	
	
	
	
	
    @Column(name = "uid", unique = true)
	public String getUid() 
	{
		return uid;
	}
	public void setUid(String uid) 
	{
		this.uid = uid;
	}

	
	
	
	//for now we don't care about unique user names 
	@NotNull
	@Column(name = "user", unique = false)
    public String getUser() 
	{
        return user;
    }
    public void setUser(String user) 
    {
        this.user = user;
    }
    
    
    
    
    public Bio getBio() {
		return bio;
	}
	public void setBio(Bio bio) {
		this.bio = bio;
	}
	
	
	
	
	public Collection<Paintings> getListOfPaintings() {
		return listOfPaintings;
	}
	public void setListOfPaintings(Collection<Paintings> listOfPaintings) {
		this.listOfPaintings = listOfPaintings;
	}
	
    
    
}