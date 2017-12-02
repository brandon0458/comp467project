package com.palmTree.controllers;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.palmTree.dao.UsersDao;
import com.palmTree.models.Paintings;
import com.palmTree.models.Users;
import com.palmTree.security.DecoderService;
import com.palmTree.services.Gzip;

@CrossOrigin()
@RestController
public class PaintingsController 
{
	@Autowired
	private UsersDao usersDao;
	@Autowired
	private DecoderService ds;
	@Autowired
	private Gzip compressionService;

	
	@RequestMapping(value = "/open", method = RequestMethod.GET)
	public String get(@RequestHeader(value="Authorization") String auth,  String test)
	{
		//System.out.println("test is: " + test);
		
		String id = ds.getID(auth);
		Users user = usersDao.findByUid(id);
		user = checkForNewUser(id, user);
		
		List<Paintings> myPainting = (List<Paintings>) user.getListOfPaintings();

		usersDao.save(user);
		
		System.out.println("\n\n\n\n" + myPainting.get(0).getFile() + "\n\n\n\n\n\n");
		
		return myPainting.get(0).getFile();
	}
	
	
	
	@RequestMapping(value = "/save", method = RequestMethod.POST)
    public ResponseEntity<String> post(@RequestHeader(value="Authorization") String auth ,@RequestBody String painting) throws ClassNotFoundException, DecoderException
    {		

		System.out.println("\n\n\n\n\n\n" + painting + "\n\n\n\n\n");
		
		
		String id = ds.getID(auth);	
		Users user = usersDao.findByUid(id);
		user = setPainting(checkForNewUser(id, user), painting);
		usersDao.save(user);
		
		
		
//		try {		
//			byte[] myCompressedString = compressionService.compress(painting);
//		
//			String serialzedSting = byteToSerialized(myCompressedString);
//
//			String id = ds.getID(auth);	
//			Users user = usersDao.findByUid(id);
//			user = setPainting(checkForNewUser(id, user), serialzedSting);
//			usersDao.save(user);
//			
//			
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
		
//		
//		//String id = ds.decodeID(auth).substring("auth0|".length());
//		String id = ds.getID(auth);	
//		Users user = usersDao.findByUid(id);
//		
//		// used to save painting
//		user = setPainting(checkForNewUser(id, user), painting);
//		
//		System.out.println("\n\n\n\npainting: " + painting + "\n\n\n\n\n\n\n");
//		
//		
//		usersDao.save(user);
//		
	    
		return new ResponseEntity<String>(painting, HttpStatus.OK);
    }
	

	private String byteToSerialized(byte[] byteArray) throws IOException 
	{
		//System.out.println(Arrays.toString(byteArray));
		
		// serialize
	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    new ObjectOutputStream(out).writeObject(byteArray);

	    String serializedString = new String(Hex.encodeHex(out.toByteArray()));
	    
	    System.out.println("\n\n\n\n\n\n");
	    
	    System.out.println(serializedString);

	    System.out.println("\n\n\n\n\n\n");
	    
	    return serializedString;
	    
	   
	}


	public void stringArrayTest(byte[] byteArray) throws IOException, ClassNotFoundException, DecoderException {
	    //String[] strs = new String[] {"test 1", "test 2", "test 3"};
	    System.out.println(Arrays.toString(byteArray));

	    // serialize
	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    new ObjectOutputStream(out).writeObject(byteArray);

	    // your string
	    String yourString = new String(Hex.encodeHex(out.toByteArray()));
	    System.out.println(yourString);

	    // deserialize
	    ByteArrayInputStream in = new ByteArrayInputStream(Hex.decodeHex(yourString.toCharArray()));
	   
	    System.out.println(Arrays.toString( (byte[]) new ObjectInputStream(in).readObject()) );
	}
	
	
	
	private Users setPainting(Users user, String file) 
	{
		ArrayList<Paintings> allPaintings = new ArrayList<Paintings>();
		
		//create a dao object
		Paintings painting = new Paintings();
		
		//set the file for it
		painting.setFile(file);
		painting.setDate("today");
		painting.setDescription(3);
		painting.setTitle("title");
		
		allPaintings.add(painting);
		
		user.setListOfPaintings(allPaintings);

		return user;
	}
	
	
	private Users checkForNewUser(String id, Users user) 
	{
		if(user == null)
		{
			user = new Users(id, "default");
		}
		return user;
	}
}