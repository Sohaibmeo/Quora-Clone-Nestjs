### Starting V2 Implementation:
## Feature (Goals) : 
#	To be implemented (High Priority):
		Search Bar (Postgres full-text search?)
		Replace account settings button and form with MUI accordion
		Profile Setup Steps
		Add relation user.notifications{ id,read:boolean,message }
		Add relation user.chats.users.messages (real time chat?)
			//Register above them with the same data from this site/Something
		Google Login
		If we have anything other than image for topic and user card we give them an error ok?
		we got a bug on profile picture (It keeps loading after a couple of switches ok?) (Retouch whole logic ?)

###	Leaving For V3? :
##		Core:
			Backend Validations
			Cache Implementation
			ChangeLog for the new update ?
			Multi-Threading
			polls
			Have some nlp logic to hide similar content when downvoting a post
			Have some logic for recommendation
##		Consider:
			mui-tiptap // or create my own simple MUI editor ??
			Organize Api Calls
##		Maybe:
			Email template : Using html instead of template rn (Vercel build issue)
			Improve mobile performance?
			Dark mode?
			Overall Font + Logo-Color and Design ETC