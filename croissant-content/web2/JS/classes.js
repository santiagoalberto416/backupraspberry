function Speaker(id, name, lastname)
{
	if(typeof id !== 'undefined') this.id = id; 
	if(typeof name !== 'undefined') this.name = name; 
	if(typeof lastname !== 'undefined') this.lastname = lastname; 
	
}

function Conference(id, title, type, description, date, speaker) 
{
	if(typeof id !== 'undefined') this.id = id; 
	if(typeof title !== 'undefined') this.title = title;
	if(typeof type !== 'undefined') this.type = type; 
	if(typeof description !== 'undefined') this.description = description; 
	if(typeof date !== 'undefined') this.date= date; 
	if(typeof time !== 'undefined') this.time = time; 
	if(typeof Speaker !== 'undefined') this.speaker = speaker; 
}

function User(id, firstName, middleName, lastName, nickname, facebookId, typeUser)
{
	if(typeof id !== 'undefined') this.id = id; 
	if(typeof firstName !== 'undefined') this.firstName = firstName; 
	if(typeof middleName !== 'undefined') this.middleName = middleName; 
	if(typeof lastName !== 'undefined') this.lastName = lastName; 
	if(typeof nickname !== 'undefined') this.nickname = nickname; 
	if(typeof facebookId !== 'undefined') this.facebookId = facebookId; 
	if(typeof typeUser !== 'undefined') this.typeUser = typeUser; 
}
