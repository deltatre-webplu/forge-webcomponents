window.ForgeWebComponents = window.ForgeWebComponents || {};
window.ForgeWebComponents.Settings = window.ForgeWebComponents.Settings || {};
window.ForgeWebComponents.Settings.RootUrl = "/api-mock/"
window.ForgeWebComponents.Config = {
	"deltatre.forge.main": {
		"WebComponentsConfiguration": {
			"SiteRoot": "//rawgit.com/deltatre-webplu/forge-webcomponents/1.6.1/",
			"Endpoints": [{
				"Name": "forge-core-style",
				"Url": "custom-styles/forge-core-style.html",
				"Permission": null
			}, {
				"Name": "forge-array-input",
				"Url": "forge-array-input/forge-array-input.html",
				"Permission": null
			}, {
				"Name": "forge-youtube-video-input",
				"Url": "forge-youtube-video-input/forge-youtube-video-input.html",
				"Permission": null
			}, {
				"Name": "forge-tags-suggestion",
				"Url": "samples/forge-tags-suggestion.html",
				"Permission": null
			}],
			"DashboardEndpoints": [{
				"Name": "forge-status-dashboard",
				"Url": "forge-dashboards/forge-status-dashboard.html",
				"Permission": null
			}, {
				"Name": "forge-commands-dashboard",
				"Url": "forge-dashboards/forge-commands-dashboard.html",
				"Permission": "AdministrationAccess"
			}, {
				"Name": "forge-editorial-dashboard",
				"Url": "forge-dashboards/forge-editorial-dashboard.html",
				"Permission": "Wcm.BasicAccess"
			}, {
				"Name": "forge-big-numbers-dashboard",
				"Url": "forge-dashboards/forge-big-numbers-dashboard.html",
				"Permission": "Wcm.BasicAccess"
			}, {
				"Name": "forge-workflow-dashboard",
				"Url": "forge-dashboards/forge-workflow-dashboard.html",
				"Permission": "Wcm.BasicAccess"
			}]
		}
	},
	"deltatre.forge.wcm": {
		"PhotoConfiguration": {
			"StorageType": "cloudinary",
			"Formats": [{
				"Name": "thumbnail",
				"Instructions": "t_thumbnail",
				"AspectRatio": "3:2",
				"Extension": ".jpg"
			}, {
				"Name": "wide",
				"Instructions": "t_wide",
				"AspectRatio": "16:9",
				"Extension": ".jpg"
			}, {
				"Name": "detail",
				"Instructions": "t_detail",
				"AspectRatio": "6:5",
				"Extension": ".jpg"
			}, {
				"Name": "thumb-face",
				"Instructions": "t_thumbface",
				"AspectRatio": null,
				"Extension": ".jpg"
			}, {
				"Name": "thumb-face-preset",
				"Instructions": "t_thumbfacepreset",
				"AspectRatio": null,
				"Extension": ".jpg"
			}, {
				"Name": "sponsor-logo",
				"Instructions": "t_sponsorlogo",
				"AspectRatio": "2:1",
				"Extension": ".jpg"
			}, {
				"Name": "story-header",
				"Instructions": "t_storyheader",
				"AspectRatio": "192:55",
				"Extension": ".jpg"
			}, {
				"Name": "story-wide",
				"Instructions": "t_storywide",
				"AspectRatio": "192:50",
				"Extension": ".jpg"
			}, {
				"Name": "list-card",
				"Instructions": "t_listcard",
				"AspectRatio": "16:9",
				"Extension": ".jpg"
			}, {
				"Name": "featured-big",
				"Instructions": "t_featuredbig",
				"AspectRatio": "1270:846",
				"Extension": ".jpg"
			}, {
				"Name": "featured-small",
				"Instructions": "t_featuredsmall",
				"AspectRatio": "979:652",
				"Extension": ".jpg"
			}, {
				"Name": "Vertical banner",
				"Instructions": "t_verticalbanner",
				"AspectRatio": "1:2",
				"Extension": ".jpg"
			}],
			"SmartCrop": true
		},
		"CustomEntitiesConfiguration": {
			"Definitions": [{
				"Code": "player",
				"Name": "Player",
				"MenuLabel": "Players",
				"Icon": "accessibility",
				"DistributionCode": "players",
				"Enabled": true,
				"UsableForTagging": true
			}, {
				"Code": "team",
				"Name": "Team",
				"MenuLabel": "Team menu",
				"Icon": "android",
				"DistributionCode": "teams",
				"Enabled": true,
				"UsableForTagging": true
			}, {
				"Code": "drivers",
				"Name": "drivers",
				"MenuLabel": "Drivers",
				"Icon": "face",
				"DistributionCode": "drivers",
				"Enabled": true,
				"UsableForTagging": true
			}, {
				"Code": "youtube",
				"Name": "YouTube",
				"MenuLabel": "YouTube Videos",
				"Icon": "ondemand_video",
				"DistributionCode": "youtubeVideos",
				"Enabled": true,
				"UsableForTagging": false
			}, {
				"Code": "test",
				"Name": "TestName",
				"MenuLabel": "TestLabel",
				"Icon": "accessible",
				"DistributionCode": "TestAPICode",
				"Enabled": true,
				"UsableForTagging": false
			}, {
				"Code": "test2",
				"Name": "test2",
				"MenuLabel": "test2",
				"Icon": null,
				"DistributionCode": "test2",
				"Enabled": true,
				"UsableForTagging": false
			}, {
				"Code": "suggest",
				"Name": "Suggest",
				"MenuLabel": "suggest",
				"Icon": null,
				"DistributionCode": "suggests",
				"Enabled": true,
				"UsableForTagging": false
			}]
		},
		"ExtendedFieldsConfiguration": {
			"Definitions": [{
				"Scope": "story",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"suggest": {
							"type": "string",
							"description": "The placeholder for suggested tags",
							"title": "Suggest",
							"extended-type": "forge-tags-suggestion"
						},
						"copyright": {
							"type": "string",
							"title": "Copyright",
							"description": "Do not remove, used for tests"
						},
						"FieldNotCamelCase": {
							"type": "string",
							"title": "Field Not Camel Case",
							"description": "Do not remove, used for tests"
						},
						"number": {
							"type": "number",
							"title": "A number value",
							"description": "Do not remove, used for tests"
						},
						"integer": {
							"type": "integer",
							"title": "An integer value",
							"description": "Do not remove, used for tests"
						},
						"showAdvertising": {
							"type": "boolean",
							"title": "A bool value",
							"description": "Do not remove, used for tests"
						},
						"kind": {
							"description": "Content kind",
							"type": "string",
							"enum": ["Live Coverage", "Editorial", "Biography"]
						}
					},
					"indexes": {
						"numberIndex": {
							"number": 1
						},
						"integerIndex": {
							"integer": 1
						},
						"FieldNotCamelCaseIndex": {
							"FieldNotCamelCase": 1
						}
					}
				}
			}, {
				"Scope": "photo",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"copyright": {
							"description": "copyright (do not remove, used for tests)",
							"type": "string",
							"localized": true
						},
						"geoLocation": {
							"description": "geojson coordinates",
							"type": "object",
							"properties": {
								"type": {
									"type": "string"
								},
								"coordinates": {
									"type": "array",
									"items": {
										"type": "number"
									}
								}
							}
						}
					},
					"indexes": {
						"geoIndex": {
							"geoLocation": "GeoSpatial"
						}
					}
				}
			}, {
				"Scope": "customentity.player",
				"JsonSchema": {
					"type": "object",
					"description": "USED FOR E2E TESTS",
					"properties": {
						"firstName": {
							"type": "string",
							"localized": true,
							"tagextradata": true
						},
						"lastName": {
							"type": "string",
							"localized": true,
							"tagextradata": true
						},
						"biography": {
							"type": "string",
							"localized": true,
							"extended-type": "rich-text",
							"tagextradata": true
						},
						"score": {
							"type": "number",
							"tagextradata": true
						},
						"country": {
							"type": "string",
							"localized": true,
							"tagextradata": true
						},
						"dateOfBirth": {
							"type": "string",
							"localized": true,
							"extended-type": "forge-datepicker-input"
						},
						"career": {
							"title": "Senior career",
							"type": "array",
							"extended-type": "forge-demo-career-input",
							"items": {
								"type": "object",
								"properties": {
									"startYear": {
										"title": "Start Year",
										"type": "number"
									},
									"endYear": {
										"title": "End Year",
										"type": "number"
									},
									"team": {
										"title": "Team",
										"type": "string"
									},
									"goals": {
										"title": "Goals",
										"type": "number"
									}
								}
							}
						}
					},
					"indexes": {
						"scoreIndex": {
							"score": -1
						},
						"careerIndex": {
							"career.endYear": 1
						}
					}
				}
			}, {
				"Scope": "tag",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"label": {
							"description": "Label style (do not remove, used for tests)",
							"type": "string",
							"enum": ["default", "primary", "success", "info", "warning", "danger"]
						}
					},
					"required": []
				}
			}, {
				"Scope": "album",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"author": {
							"type": "string",
							"title": "Author",
							"description": "The author of the album"
						},
						"copyright": {
							"description": "copyright",
							"type": "string"
						},
						"kind": {
							"description": "Content kind",
							"type": "string",
							"localized": true,
							"enum": ["Live Coverage", "Editorial", "Biography"]
						}
					},
					"indexes": {
						"kindIndexField": {
							"kind": 1
						}
					}
				}
			}, {
				"Scope": "storyparts.photo",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"caption": {
							"type": "string",
							"description": "A custom caption for the photo"
						},
						"layoutPreference": {
							"type": "string",
							"enum": ["Left", "Left Stretched", "Middle", "Middle Stretched", "Big Title Picture", "Right", "Right Stretched"],
							"description": "The position preference of the photo"
						}
					}
				}
			}, {
				"Scope": "storyparts.markdown",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"quote": {
							"type": "boolean",
							"description": "Indicates if this text has to be displayed as a quote"
						},
						"allowFloats": {
							"type": "boolean",
							"description": "Indicates if this text allows floating content (to its left or right)"
						}
					}
				}
			}, {
				"Scope": "storyparts.album",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"caption": {
							"type": "string",
							"description": "A custom caption for the album"
						},
						"layoutPreference": {
							"type": "string",
							"enum": ["Slideshow", "Slideshow Stretched"],
							"description": "The layout preference for this album"
						}
					}
				}
			}, {
				"Scope": "storyparts.cartoon-players",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"author": {
							"type": "string",
							"title": "Author",
							"description": "The author of the content"
						},
						"copyright": {
							"type": "string"
						},
						"positionPreference": {
							"type": "string",
							"enum": ["Left", "Middle", "Right"],
							"description": "The position preference of the content"
						}
					}
				}
			}, {
				"Scope": "storyparts.customentity.player",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"positionPreference": {
							"type": "string",
							"enum": ["FloatLeft", "Center", "FloatRight"],
							"description": "The position preference of the content"
						},
						"someNumbers": {
							"type": "array",
							"items": {
								"type": "integer"
							},
							"title": "Numbers!",
							"description": "put some numbers please"
						}
					}
				}
			}, {
				"Scope": "document",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"author": {
							"type": "string",
							"title": "Author",
							"description": "The author of the document (used by tests)!"
						},
						"arrayTest": {
							"type": "array",
							"title": "arrayTest",
							"localized": true
						}
					}
				}
			}, {
				"Scope": "customentity.team",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"city": {
							"type": "string",
							"title": "City",
							"description": "The city of the team"
						},
						"country": {
							"type": "string"
						},
						"showAdvertising": {
							"description": "True to show advertising",
							"title": "Show banners",
							"type": "boolean"
						},
						"description": {
							"type": "string",
							"localized": true,
							"extended-type": "rich-text"
						},
						"confederation": {
							"description": "Confederation kind",
							"type": "string",
							"enum": ["Uefa", "Concacaf", "SeriaA"]
						},
						"polymerArrayEnum": {
							"description": "polymer array enum",
							"type": "array",
							"items": {
								"type": "string",
								"enum": ["UEFA European Football Championship", "FIFA World Cup", "FIFA Confederations Cup", "CAF Africa Cup of Nations", "CONMEBOL Copa América", "CONCACAF Gold Cup", "UEFA Champions League", "FIFA Club World Cup", "CAF Champions League", "CONMEBOL Copa Libertadores", "Deutscher Pokal"]
							}
						},
						"language": {
							"description": "Language of the team",
							"type": "string",
							"enum": ["Ignorante", "Forbito", "Multi"]
						},
						"OfficialFanClubs": {
							"description": "list all the official fanclubs",
							"type": "array",
							"items": {
								"type": "string"
							},
							"localized": true
						},
						"OQWERTYUIOP": {
							"description": "random",
							"type": "array",
							"items": {
								"type": "string"
							}
						},
						"cupsWon": {
							"description": "list all the cups the team won",
							"type": "array",
							"items": {
								"type": "string",
								"enum": ["UEFA European Football Championship", "FIFA World Cup", "FIFA Confederations Cup", "CAF Africa Cup of Nations", "CONMEBOL Copa América", "CONCACAF Gold Cup", "UEFA Champions League", "FIFA Club World Cup", "CAF Champions League", "CONMEBOL Copa Libertadores", "Deutscher Pokal"]
							}
						}
					},
					"indexes": {
						"countryIndex": {
							"country": -1
						},
						"languageTestIndex": {
							"language": 1
						},
						"fanClubsIndex": {
							"OfficialFanClubs": 1
						},
						"OQWERTYUIOPIndex": {
							"OQWERTYUIOP": 1
						},
						"cupsWonIndex": {
							"cupsWon": 1
						}
					}
				}
			}, {
				"Scope": "customentity.drivers",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"countryCode": {
							"type": "string",
							"title": "Country Code",
							"description": "The code of the country of the driver. E.g. ITA",
							"tagextradata": true
						},
						"team": {
							"title": "Team",
							"type": "string",
							"enum": ["Mercedes", "Ferrari", "Williams", "Red Bull Racing", "Force India", "Toro Rosso", "Sauber", "Haas", "Manor Racing", "Renault"],
							"tagextradata": true
						},
						"wins": {
							"title": "Race victories",
							"type": "number",
							"description": "The total number of victories",
							"tagextradata": true
						},
						"points": {
							"title": "Points in career",
							"type": "number",
							"description": "The total number of points",
							"tagextradata": true
						},
						"bio": {
							"title": "Brief Bio",
							"type": "string",
							"localized": true,
							"extended-type": "rich-text"
						},
						"showAdvertising": {
							"description": "True to show advertising",
							"title": "Show banners",
							"type": "boolean",
							"tagextradata": true
						}
					},
					"system": {
						"title": {
							"title": "name"
						}
					},
					"indexes": {
						"pointsIndex": {
							"points": -1
						}
					}
				}
			}, {
				"Scope": "customentity.youtube",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"description": {
							"type": "string",
							"description": "The description of the video",
							"title": "Description",
							"extended-type": "rich-text",
							"localized": true
						},
						"videoId": {
							"type": "string",
							"description": "The unique identifier of the video",
							"title": "Video Id",
							"localized": true,
							"extended-type": "forge-youtube-video-input",
							"tagextradata": true
						}
					}
				}
			}, {
				"Scope": "storyparts.customentity.team",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"adWords": {
							"type": "array",
							"items": {
								"type": "string"
							},
							"title": "AdWords",
							"description": "list all the adWords"
						},
						"myEnum": {
							"type": "array",
							"items": {
								"type": "string",
								"enum": ["Uan", "Four", "Five", "Jonatan"]
							},
							"description": "The position preference of the content"
						}
					}
				}
			}, {
				"Scope": "customentity.test",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"author": {
							"type": "string",
							"title": "Author",
							"description": "Name and Surname of the author",
							"tagextradata": true
						},
						"copyright": {
							"type": "string",
							"tagextradata": true,
							"localized": true
						},
						"description": {
							"title": "Description",
							"type": "string",
							"description": "A short introduction (100 words)",
							"extended-type": "rich-text",
							"localized": true
						},
						"showAdvertising": {
							"title": "Show banners",
							"description": "True to show advertising",
							"type": "boolean"
						},
						"kind": {
							"title": "Kind",
							"type": "string",
							"enum": ["Live Coverage", "Editorial", "Biography"],
							"tagextradata": true
						}
					}
				}
			}, {
				"Scope": "customentity.test2",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"localizedArray": {
							"description": "Localized Array",
							"type": "array",
							"localized": true,
							"items": {
								"type": "string",
								"enum": ["UEFA European Football Championship", "FIFA World Cup", "FIFA Confederations Cup", "CAF Africa Cup of Nations", "CONMEBOL Copa América", "CONCACAF Gold Cup", "UEFA Champions League", "FIFA Club World Cup", "CAF Champions League", "CONMEBOL Copa Libertadores", "Deutscher Pokal"]
							}
						},
						"kind": {
							"title": "Kind",
							"type": "string",
							"enum": ["Live Coverage", "Editorial", "Biography"],
							"tagextradata": true
						}
					}
				}
			}, {
				"Scope": "customentity.suggest",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"suggest": {
							"type": "string",
							"description": "The placeholder for suggested tags",
							"title": "Suggest",
							"extended-type": "forge-tags-suggestion"
						}
					}
				}
			}, {
				"Scope": "customentity.test3",
				"JsonSchema": {
					"type": "object",
					"properties": {
						"description": {
							"type": "string",
							"title": "Brief description",
							"description": "Brief description of the venue",
							"localized": true,
							"extended-type": "rich-text"
						},
						"history": {
							"type": "string",
							"localized": true,
							"extended-type": "rich-text",
							"tagextradata": true
						},
						"capacity": {
							"type": "number",
							"description": "Stadium &quot;s capacity",
							"tagextradata": true
						},
						"active": {
							"type": "boolean",
							"localized": true,
							"tagextradata": true
						},
						"language": {
							"type": "string"
						},
						"limit": {
							"type": "string"
						},
						"size": {
							"type": "string"
						},
						"aCtivs2": {
							"type": "boolean",
							"localized": true,
							"tagExtraData": true
						},
						"datetime": {
							"type": "string",
							"format": "date-time",
							"description": "The date//time of the entity"
						},
						"ListOfStringsExtended": {
							"description": "A list of strings",
							"type": "array",
							"localized": true,
							"format": "date-time",
							"tagextradata": true,
							"items": {
								"type": "string"
							}
						},
						"ListOfStringEnums": {
							"description": "A list of strings",
							"type": "array",
							"items": {
								"type": "string",
								"enum": ["one", "two", "three", "four"]
							}
						},
						"ListOfStringsEnumsExtended": {
							"description": "A list of strings",
							"type": "array",
							"localized": true,
							"format": "date-time",
							"tagextradata": true,
							"items": {
								"type": "string",
								"enum": ["Italy", "Uk", "France", "Germany"]
							}
						},
						"ListOfNumbersEnums": {
							"description": "A list of numbers as enum",
							"type": "array",
							"items": {
								"type": "number",
								"enum": [2, 3, 4, 5]
							}
						},
						"ListOfNumbersEnumsExtended": {
							"description": "A list of number as enum extended",
							"type": "array",
							"localized": true,
							"format": "date-time",
							"tagextradata": true,
							"items": {
								"type": "number",
								"enum": [1, 2, 3, 4]
							}
						},
						"ListOfIntegers": {
							"description": "A list of Integers",
							"type": "array",
							"items": {
								"type": "integer"
							}
						},
						"ListOfIntegersExtended": {
							"description": "A list of integers",
							"type": "array",
							"localized": true,
							"tagextradata": true,
							"items": {
								"type": "integer"
							}
						},
						"ListOfNumbers": {
							"description": "A list of numbers",
							"type": "array",
							"items": {
								"type": "number"
							}
						},
						"ListOfNumbersExtended": {
							"description": "A list of number",
							"type": "array",
							"localized": true,
							"tagextradata": true,
							"items": {
								"type": "string"
							}
						},
						"ListOfBooleans": {
							"description": "A list of boolean",
							"type": "array",
							"items": {
								"type": "boolean"
							}
						},
						"ListOfBooleansExtended": {
							"description": "A list of boolean",
							"type": "array",
							"localized": true,
							"tagextradata": true,
							"items": {
								"type": "boolean"
							}
						},
						"surface": {
							"type": "string",
							"localized": true,
							"tagextradata": true,
							"enum": ["Natural grass", "Latitude 36 Bermuda Grass", "Other"]
						}
					},
					"indexes": {
						"descriptionIndex": {
							"description": 1
						},
						"capacityIndex": {
							"capacity": 1
						},
						"ListOfStringsEnumIndex": {
							"ListOfStringEnums": 1
						},
						"languageIndex": {
							"language": 1
						},
						"limitIndex": {
							"limit": 1
						},
						"sizeIndex": {
							"size": 1
						}
					}
				}
			}]
		},
		"ExternalStoryParts": [{
			"Name": "OEmbed",
			"Definition": {
				"Icon": "share",
				"Schema": {
					"title": "Embed social content",
					"type": "object",
					"properties": {
						"url": {
							"type": "string",
							"description": "An url representing the content you wish to embed"
						},
						"maxwidth": {
							"type": "integer",
							"description": "The max width in pixel (optional)"
						},
						"maxheight": {
							"type": "integer",
							"description": "The max height in pixel (optional)"
						}
					}
				},
				"Search": "http://localhost:60191/deltatre.forge.wcm/api/storyparts/oembed/search"
			}
		}, {
			"Name": "cartoon-players",
			"Definition": {
				"Icon": "http://m.img.brothersoft.com/android/79/795ae74b6b6a126c29be851665fb7157_icon.png",
				"Schema": {
					"title": "Holly & Benji players",
					"type": "object",
					"properties": {
						"firstName": {
							"type": "string"
						},
						"lastName": {
							"type": "string"
						},
						"age": {
							"description": "Age in years",
							"type": "integer",
							"minimum": 0
						},
						"isRegular": {
							"description": "Is a regular player or is a bench warmer",
							"type": "boolean"
						},
						"team": {
							"description": "In which team does he play?",
							"enum": ["New Team", "Muppet"]
						}
					},
					"required": ["firstName", "lastName"]
				},
				"Search": "http://sample-externaldata.azurewebsites.net/parts/search"
			}
		}, {
			"Name": "fifacom-players",
			"Definition": {
				"Icon": "account_box",
				"Schema": {
					"title": "FifaCom Players",
					"type": "object",
					"properties": {
						"name": {
							"type": "string"
						}
					},
					"required": ["name"]
				},
				"Search": "http://externaldata.azurewebsites.net/players/search"
			}
		}],
		"ExternalFeedsConfiguration": {
			"ExternalFeedsEndpoints": [{
				"TargetEntity": "story",
				"Name": "FifaRss",
				"Url": "http://sample-externaldata.azurewebsites.net/fifa-rss",
				"Permission": null
			}, {
				"TargetEntity": "photo",
				"Name": "Getty",
				"Url": "http://sample-gettyintegration.azurewebsites.net/feeds",
				"Permission": null
			}, {
				"TargetEntity": "document",
				"Name": "SampleDocuments",
				"Url": "http://sample-externaldata.azurewebsites.net/feeds/document",
				"Permission": null
			}, {
				"TargetEntity": "album",
				"Name": "SampleAlbums",
				"Url": "http://sample-externaldata.azurewebsites.net/feeds/album",
				"Permission": null
			}, {
				"TargetEntity": "selection",
				"Name": "SampleSelections",
				"Url": "http://sample-externaldata.azurewebsites.net/feeds/selection",
				"Permission": null
			}, {
				"TargetEntity": "customEntity.player",
				"Name": "SampleCEPlayers",
				"Url": "http://sample-externaldata.azurewebsites.net/feeds/customEntityPlayer",
				"Permission": null
			}, {
				"TargetEntity": "story",
				"Name": "StoriesWithError",
				"Url": "http://sample-externaldata.azurewebsites.net/feeds/storiesImportError",
				"Permission": null
			}, {
				"TargetEntity": "customEntity.youtube",
				"Name": "Youtube",
				"Url": "http://sample-youtubeintegration.azurewebsites.net/feeds/FIFATV",
				"Permission": null
			}]
		}
	}
}
