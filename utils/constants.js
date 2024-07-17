module.exports.apiLoginKey = '5KP3u95bQpv';
module.exports.transactionKey = '346HZ32z3fP4hTG2';

module.exports.registrationSUB = `Greetings! Welcome to ColoHealth Provider Portal.`;
module.exports.registrationHTML  = (match) => (
        `
<h2 style="background-color:#140342;color:white;padding:10px;"><span><img alt="logo" title="logo-title" style="display:block;" height="60" width="120" src="${process.env.REACT_APP_BACKEND_URL}/logo/Email_Sign_Logo.png"></span>ColoHealth</h2>

                                                <p><strong>Dear ${match?.firstName+" "+match?.lastName || 'User'},</strong></p>

                                                <p>We hope you are doing well.</p>

                                                <p>Welcome to <strong style="color:#0284c7;padding:5px; font-size:16px;">ColoHealth</strong> we are thrilled to have you on board!</p>

                                                <p>Your account has been created on the <strong style="color:#0284c7;text-decoration:underline;">ColoHealth Provider Portal</strong></p>

                                                <p>Colohealth is an online platform that has been serving in the field for the past 9 years.</p>

                                                <p>Please make sure to NOT share your credentials with anyone as your profile may contain sensitive data of your patients</p>

                                                <p>Links for the social media accounts of ColoHealth Account.</p>

                                                <p><strong>Our social media accounts:</strong></p>

                                                <p>Linkedin</p>
                                                <p><a href="https://www.linkedin.com/company/conative-it-solutions-pvt-ltd/mycompany/company" target="_blank">https://www.linkedin.com/company/conative-it-solutions-pvt-ltd/mycompany/company</p>

                                                <p>Instagram:</p>
                                                www.instagram.com/conative_it_solutions/</p>

                                                <p>Facebook:</p>
                                                <p><a href="https://www.facebook.com/conativeitsolutions" target="_blank">https://www.facebook.com/conativeitsolutions</p>

                                                <p>Twitter:</p>
                                                <p><a href="https://twitter.com/CITSINDORE" target="_blank">https://twitter.com/CITSINDORE</p>

                                                <p>Pinterest:</p>
                                                <p><a href="https://in.pinterest.com/conativeitsolutions/" target="_blank">https://in.pinterest.com/conativeitsolutions/</p>

                                                <p>Skype ID:</p>
                                                <p><a href="skype:conativeitsolutions" target="_blank">conativeitsolutions</a></p>

                                                <p><strong>Warm regards,</strong></p>
                                                <p><strong>ColoHealth Team.</strong></p>
`)


exports.defaultPage = (sanitizedPageName) => `

<div id="scrollable-content" style="width:80%;border-right: 1px solid rgba(0,0,0,0.25);overflow-y:scroll;height:100%;padding-bottom: 3%">
	<div class="page-name" style="display:flex; align-items:center;justify-content:space-between;padding:8px 24px;">
		<h1 id="ejspageName">${sanitizedPageName}</h1>
	</div>
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
	<style>
		.section-input-container .form-label button{
			opacity: 0;
			transition: all 300ms ease;
		}
		.section-input-container:hover .form-label button{
			opacity: 1;
		}
		.swal2-deny{
			background-color: #d8d8d8 !important;
			color: #000 !important;
		}
		.swal2-confirm{
			background-color: #315BC1 !important;
		}
		.swal2-confirm:focus {
			box-shadow: 0 0 0 3px #315BC111 !important;
		}
		.swal2-deny:focus {
			box-shadow: none !important;
		}
	</style>
	<!-- SECTION CONTAINER -->
	<div id="page-section-container" style="display: flex;width: 100%;flex-direction: column;align-items: center;justify-content: start;">
		<!-- SECTION DEFAULT RENDER 1 -->
		<div style="border-bottom: 1px solid rgba(0,0,0,0.25);padding: 25px 0px;width: 100%;">
			<div  style="margin: 0 auto;display: flex;flex-direction: column;align-items: center;justify-content: start;gap: 25px;width: 80%;">
				<input value="<%= pageData?.pageDefaultTitle %>" style="width: 100%;font-size: 54px;padding: 15px 25px;" type="text" placeholder="Add Title" name="pageDefaultTitle" id="default-page-title">
				<textarea id="default-page-content" style="width: 100%;padding: 15px 25px;" name="pageDefaultContent" cols="30" rows="10" placeholder="Start writing text or HTML">
				<%= pageData?.pageDefaultContent %>
				</textarea>
			</div>
		</div>

		<!-- SECTION DEFAULT RENDER 2 -->
		<% for(let i=0; i < pageData.sections.length; i++) { %>
		<div class="section-wr" style="width: 100%;padding: 15px;border-bottom: 1px solid rgba(0,0,0,0.25);">
			<div style="width: 100%;">
				<input type="hidden" name="section-name" value="<%= pageData.sections[i].sectionName %>">
				<div style="width:100%;margin-bottom:10px; display: flex;align-items: center;justify-content: space-between;">
					<div style="width: 80%;">
						<input id="<%= pageData.sections[i].sectionName?.toLowerCase().split(' ').join() %>" type="checkbox" class="section-choose-checkbox">
						<label style="font-size: 13px; font-weight: 600; color:#315BC1;font-style: italic;" for="<%= pageData.sections[i].sectionName?.toLowerCase().split(' ').join() %>">Working on this section</label>
					</div>
					<% if(pageData.sections[i].sectionName !== "SEO")  { %>
					<div>
						<button onclick="hanldeRemoveSection('<%= pageData.sections[i].sectionName %>')" style="color: #C9356E;font-weight: 600;">Remove Section</button>
					</div>
					<% } %>
				</div>
				<div>
					<h5><%= pageData.sections[i].sectionName %></h5>
				</div>
				<div class="inputFieldsContainer">
					<% if(pageData.sections[i].sectionContent.length > 0) { for(let j=0; j < pageData.sections[i].sectionContent.length; j++) { %>
						<% if(pageData.sections[i].sectionContent[j].elementName == "input" && pageData.sections[i].sectionContent[j].elementAttrType === 'file'){ %>
							<div class="section-input-container">
								<label class="mb-3 mt-3" style="display: block;">Image Preview:</label>
								<div class="mb-3">
									<img src="/images/<%= pageData.sections[i].sectionContent[j].elementAttrSrcImg || 'icons8-image-100.png' %>" style="width: 150px;height: auto;box-shadow: 2px 2px 12px 0px rgba(0,0,0,0.25);border-radius: 10px;" alt="<%= pageData.sections[i].sectionContent[j].elementAttrAltImg %>">
								</div>
								<label class="form-label" for="<%= pageData.sections[i].sectionContent[j].elementAttrFor %>">
									<%= pageData.sections[i].sectionContent[j].elementLabelName %>
									<button onclick="handleElementDelete('<%= pageData.sections[i].sectionName %>', '<%= pageData.sections[i].sectionContent[j].elementAttrName %>')" style="border: none; color: #C9356E;font-weight: 700; font-size: 12px;"><i class="fa-solid fa-trash" style="color: #222b33;font-size: 12px; margin-right: 5px;"></i>Delete</button>
								</label>
								<input class="form-control mb-3" type="<%= pageData.sections[i].sectionContent[j].elementAttrType %>" name="<%= pageData.sections[i].sectionContent[j].elementAttrName %>" value="<%= pageData.sections[i].sectionContent[j].elementValue %>">
							</div>
						<% } else if(pageData.sections[i].sectionContent[j].elementName == "input"){ %>
							<div class="section-input-container">
								<label class="form-label" for="<%= pageData.sections[i].sectionContent[j].elementAttrFor %>">
									<%= pageData.sections[i].sectionContent[j].elementLabelName %>
									<button onclick="handleElementDelete('<%= pageData.sections[i].sectionName %>', '<%= pageData.sections[i].sectionContent[j].elementAttrName %>')" style="border: none; color: #C9356E;font-weight: 700; font-size: 12px;"><i class="fa-solid fa-trash" style="color: #222b33;font-size: 12px; margin-right: 5px;"></i>Delete</button>
								</label>
								<input class="form-control mb-3" type="<%= pageData.sections[i].sectionContent[j].elementAttrType %>" name="<%= pageData.sections[i].sectionContent[j].elementAttrName %>" value="<%= pageData.sections[i].sectionContent[j].elementValue %>">
							</div>
						<% } else if(pageData.sections[i].sectionContent[j].elementName == "textarea") { %>
							<div class="section-input-container">
								<label class="form-label" for="<%= pageData.sections[i].sectionContent[j].elementAttrFor %>" >
									<%= pageData.sections[i].sectionContent[j].elementLabelName %>
									<button onclick="handleElementDelete('<%= pageData.sections[i].sectionName %>', '<%= pageData.sections[i].sectionContent[j].elementAttrName %>')" style="border: none; color: #C9356E;font-weight: 700; font-size: 12px;"><i class="fa-solid fa-trash" style="color: #222b33;font-size: 12px; margin-right: 5px;"></i>Delete</button>
								</label>
								<textarea class="mb-3" name="<%= pageData.sections[i].sectionContent[j].elementAttrName %>" id="<%= pageData.sections[i].sectionContent[j].elementAttrId %>" >
									<%= pageData.sections[i].sectionContent[j].elementValue %>
								</textarea>
							</div>
						<% } else if(pageData.sections[i].sectionContent[j].elementName == "array") { %>
							<div style="font-size: 13px;">
								<label class="form-label mt-3">
									<%= pageData.sections[i].sectionContent[j].elementLabelName %>
								</label>
								<button onclick="openItemModal('<%= pageData.sections[i].sectionContent[j].elementAttrName %>', '<%= pageData.sections[i].sectionName %>')" type="button"
									class="button-secondary" style="display: block;margin-bottom: 15px;">
									<i class="fa-solid fa-plus" style="margin-right: 10px;"></i>Add new item
								</button>
								<% if(pageData.sections[i].sectionContent[j].elementItems?.length > 0) { %>
									<table width="100%" cellpadding="0" cellspacing="0">
										<thead>
											<tr style="border-bottom: 1px solid rgba(0,0,0,0.25);background-color:aliceblue;">
												<th></th>
												<th style="padding:10px 0px">Index</th>
												<th>Id</th>
												<th>Item</th>
												<th>Item Type</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody class="sortable" data-sectionname="<%= pageData.sections[i].sectionName %>" data-arrayname="<%= pageData.sections[i].sectionContent[j].elementAttrName %>">
											<% pageData.sections[i].sectionContent[j].elementItems.forEach((arrayitem, index)=> { %>
												<tr style="border-bottom: 1px solid rgba(0,0,0,0.25);background-color:#fff;">
													<td style="padding: 5px 10px;font-size: 13px;font-weight: 600;">
														<i class="fa-solid fa-grip-vertical"></i></td>
													<td style="padding: 5px 10px;font-size: 13px;font-weight: 600;">
														<%= index+1 %>
													</td>
													<td style="padding: 5px 10px;font-size: 13px;font-weight: 600;">
														<%= arrayitem?.id %>
													</td>
													<td style="padding: 5px 10px;font-size: 13px;font-weight: 600;">
														<% if(arrayitem.type==="String" ) { %>
															<%= arrayitem.value %>
														<% } else if(arrayitem.type==="Textarea" ) { %>
															<button onclick="openEditorViewer('<%= pageData.sections[i].sectionName %>','<%= pageData.sections[i].sectionContent[j].elementAttrName %>','<%= arrayitem.id %>','<%= arrayitem.type %>','<%= JSON.stringify(arrayitem.value) %>')" class="button-secondary">
																<strong style="color: #2a5298;">Text Content</strong>(Click to View)
															</button>
														<% } else if(arrayitem.type==="JSON" ) { %>
															<button type="button" onclick="openJSONViewer('<%= pageData.sections[i].sectionContent[j].elementAttrName %>', '<%= arrayitem.id %>', '<%= arrayitem.type %>', '<%= JSON.stringify(arrayitem.value) %>', '<%= index %>' )"
																class="button-secondary">
																<strong style="color: #2a5298;">JSON Data</strong>(Click to View)
															</button>
														<% } else if(arrayitem.type==="Image" ) { %>
															<img src="/images/<%= arrayitem.value %>" width="50" alt="">
														<% } %>
													</td>
													<td
														style="padding: 5px 10px;font-size: 13px;font-weight: 600;">
														<%= arrayitem.type %>
													</td>
													<td
														style="padding: 5px 10px;font-size: 13px;font-weight: 600;">
														<i class="fa-solid fa-trash-can"
															style="cursor: pointer;"
															onclick="deleteArrayItem('<%= pageData.sections[i].sectionName %>','<%= pageData.sections[i].sectionContent[j].elementAttrName %>', '<%= arrayitem.id %>')"></i>
													</td>
												</tr>
												<% }) %>
										</tbody>
									</table>
									<% } %>
							</div>
						<% } else if(pageData.sections[i].sectionContent[j].elementName == "input-button"){ %>
							<div class="section-input-container">
								<label style="display: block;" class="form-label" for="<%= pageData.sections[i].sectionContent[j].elementAttrFor %>">
									<%= pageData.sections[i].sectionContent[j].elementLabelName %>
									<button onclick="handleElementDelete('<%= pageData.sections[i].sectionName %>', '<%= pageData.sections[i].sectionContent[j].elementAttrName %>')" style="border: none; color: #C9356E;font-weight: 700; font-size: 12px;"><i class="fa-solid fa-trash" style="color: #222b33;font-size: 12px; margin-right: 5px;"></i>Delete</button>
								</label>
								<button onclick="openButtonModal('<%= pageData.sections[i].sectionContent[j].elementValue %>','<%= pageData.sections[i].sectionContent[j].elementAttrName %>','<%= pageData.sections[i].sectionName %>', '<%= pageData.sections[i].sectionContent[j].elementAttrHref %>')" style="padding: 10px 15px;" class="button-secondary">
									<%= pageData.sections[i].sectionContent[j].elementValue || "Click to add data" %>
									<% if(pageData.sections[i].sectionContent[j].elementAttrHref) { %>
										<span style="font-weight: 600; color: #315BC1; border-left:1px solid rgba(0,0,0,0.25);padding-left: 10px;" >Link: <%= pageData.sections[i].sectionContent[j].elementAttrHref %></span>
									<% } %>
								</button>
							</div>
						<% } else if(pageData.sections[i].sectionContent[j].elementName == "input-link"){ %>
							<div class="section-input-container">
								<label style="display: block;" class="form-label" for="<%= pageData.sections[i].sectionContent[j].elementAttrFor %>">
									<%= pageData.sections[i].sectionContent[j].elementLabelName %>
									<button onclick="handleElementDelete('<%= pageData.sections[i].sectionName %>', '<%= pageData.sections[i].sectionContent[j].elementAttrName %>')" style="border: none; color: #C9356E;font-weight: 700; font-size: 12px;"><i class="fa-solid fa-trash" style="color: #222b33;font-size: 12px; margin-right: 5px;"></i>Delete</button>
								</label>
								<button onclick="openLinkModal('<%= pageData.sections[i].sectionContent[j].elementAttrName %>','<%= pageData.sections[i].sectionName %>')" style="padding: 10px 15px; background-color: #d8d8d8;border:none; border-bottom: 2px solid #315BC1;">
									<%= pageData.sections[i].sectionContent[j].elementValue || "Click to add data" %>
									<% if(pageData.sections[i].sectionContent[j].elementAttrHref) { %>
										<span style="font-weight: 600; color: #315BC1; border-left:1px solid rgba(0,0,0,0.25);padding-left: 10px;" >Link: <%= pageData.sections[i].sectionContent[j].elementAttrHref %></span>
									<% } %>
								</button>
							</div>
						<% }} } else { %>
							<div style="background-color: #fff;border-radius: 6px;border:1px solid rgba(0,0,0,0.25);display: flex;align-items: center;justify-content: center;flex-direction: column;gap: 0px;padding: 15px;">
								<h3 style="color: #484848;font-size: 18px;">No elements present in this section</h3>
								<p style="font-size: 13px;font-weight: 400;color: #484848;margin: 0;">Add Elements to continue!</p>
							</div>
						<% } %>
				</div>
			</div>
		</div>
		<% } %>
	</div>
</div>

<!-- Your existing content goes here -->

<!-- Right sidebar for adding new fields -->
<div id="sidebar" style="width:20%;height: 100%;padding: 10px;display: flex;flex-direction: column;align-items: center;justify-content: start;gap: 15px;" class="sidebar custom-field">
	<div style="background-color: #fff;border-radius: 8px; padding: 10px; width: 100%;border: 1px solid rgba(0,0,0,0.25);display: flex;flex-direction: column;gap: 5px;">
		<h5 style="font-weight: 600; font-size: 14px; text-transform: uppercase;margin-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.25);padding-bottom: 5px;">Publish</h5>
		<table cellspacing="0" cellpadding="0">
			<tr>
				<td style="width: 30%;">
					<p style="margin: 0;">
						<i style="text-align: center;width: 15px;display: inline-block;color: #484848;font-size: 14px;" class="fa-regular fa-paper-plane"></i>
						<span style="display: inline-block;color: #484848;font-weight:500;font-size: 13px;margin-left: 5px;">Status</span>
					</p>
				</td>
				<td style="width: 70%;">
					<span data-bs-toggle="collapse" href="#pageStatusCollapse" role="button" aria-expanded="false" aria-controls="pageStatusCollapse" style="display: inline-block;color: <%= pageData?.status === 'published' ? '#65B741':'inherit' %> ;font-weight:600;font-size: 13px;text-transform: capitalize;width: 100%;padding: 5px;"><%= pageData?.status || '--' %></span>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<div class="collapse" id="pageStatusCollapse">
						<div style="display: flex;align-items: start;justify-content: start;flex-direction: column;padding: 10px;width: 300px;background-color: #f5f7f7;border-top: 1px solid rgba(0,0,0,0.25);">
							<h5 style="font-size: 14px;">Publish this post:</h5>
							<p style="margin: 0;font-size: 11px;font-weight: 400;margin-bottom: 10px;">Manage the status of this post, a only posts that are published will be accessible publicly.</p>
							<div style="display: flex;align-items: center;padding: 5px;gap: 5px;">
								<input type="radio" value="published" <%= pageData?.status =="published" && "checked" %>  onchange="handlePageStatus(this)" name="pageStatus" id="publishPage">
								<label for="publishPage" style="font-size: 12px;font-weight: 500;">Publish</label>
							</div>
							<div style="display: flex;align-items: center;padding: 5px;gap: 5px;margin-bottom: 10px;">
								<input type="radio" value="draft" <%= pageData?.status =="draft" && "checked" %> onchange="handlePageStatus(this)" name="pageStatus" id="withdrawPage">
								<label for="withdrawPage" style="font-size: 12px;font-weight: 500;">Draft</label>
							</div>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<td style="width: 30%;">
					<p style="margin: 0;">
						<i style="text-align: center;width: 15px;display: inline-block;color: #484848;font-size: 14px;" class="fa-solid fa-eye"></i>
						<span style="display: inline-block;color: #484848;font-weight:500;font-size: 13px;margin-left: 5px;">Visibility</span>
					</p>
				</td>
				<td style="width: 70%;">
					<span data-bs-toggle="collapse" href="#pageVisibilityCollapse" role="button" aria-expanded="false" aria-controls="pageVisibilityCollapse" style="display: inline-block;color: #484848;font-weight:500;font-size: 13px;padding: 5px;width: 100%;text-transform: capitalize;"><%= pageData?.visibility || '--' %></span>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<div class="collapse" id="pageVisibilityCollapse">
						<div style="display: flex;align-items: start;justify-content: start;flex-direction: column;padding: 10px;width: 300px;background-color: #f5f7f7;border-top: 1px solid rgba(0,0,0,0.25);">
							<h5 style="font-size: 14px;">Page Visibility:</h5>
							<p style="margin: 0;font-size: 11px;font-weight: 400;margin-bottom: 10px;">Manage the visibility of this page, a only posts that are visible will be accessible publicly.</p>
							<div style="display: flex;align-items: center;padding: 5px;gap: 5px;">
								<input onchange="handlePageVisibility(this)" <%= pageData?.visibility =="visible" && "checked" %> value="visible" type="radio" name="pageVisibility" id="makePageVisible">
								<label for="makePageVisible" style="font-size: 12px;font-weight: 500;">Visible (Public)</label>
							</div>
							<div style="display: flex;align-items: center;padding: 5px;gap: 5px;">
								<input onchange="handlePageVisibility(this)" <%= pageData?.visibility =="hidden" && "checked" %> value="hidden" type="radio" name="pageVisibility" id="makePageHidden">
								<label for="makePageHidden" style="font-size: 12px;font-weight: 500;">Hidden</label>
							</div>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<td style="width: 30%;">
					<p style="margin: 0;">
						<i style="text-align: center;width: 15px;display: inline-block;color: #484848;font-size: 14px;" class="fa-solid fa-code-compare"></i>
						<span style="display: inline-block;color: #484848;font-weight:500;font-size: 13px;margin-left: 5px;">Revisions</span>
					</p>
				</td>
				<td style="width: 70%;">
					<span data-bs-toggle="collapse" href="#pageRevisionsCollapse" role="button" aria-expanded="false" aria-controls="pageRevisionsCollapse"  style="display: inline-block;color: #484848;font-weight:500;font-size: 13px;padding: 5px;width: 100%;"><%= pageData?.revisions || '--' %></span>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<div class="collapse" id="pageRevisionsCollapse">
						<div class="card card-body">
						  Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
						</div>
					</div>
				</td>
			</tr>
		</table>
		<button type="submit" form="page-data-form" class="mt-3 button-main button-main-md" onclick="submitFields()">Update Page</button>
	</div>
	<div style="background-color: #fff;border-radius: 8px; padding: 10px; width: 100%;border: 1px solid rgba(0,0,0,0.25);display: flex;flex-direction: column;gap: 5px;">
		<h5 style="font-weight: 600; font-size: 14px; text-transform: uppercase;border-bottom: 1px solid rgba(0,0,0,0.25);padding-bottom: 5px;">Sections</h5>
		<ul style="color: #484848;font-weight:600;font-size: 14px;height:150px;overflow-y:auto;">
			<% pageData.sections.forEach(section => { %>
				<li><%= section?.sectionName %></li>
			<% }) %>	
		</ul>
		<div style="width: 100%; display: flex; align-items: center; justify-content: space-between;border-top: 1px solid rgba(0,0,0,0.25); padding-top: 10px;">
			<h3 style="font-size: 14px;margin: 0;font-weight: 600;">Add New Section</h3>
			<button type="button" class="button-main button-main-sm" onclick="openNewSectionModal()">Add</button>
		</div>
	</div>
	<div style="background-color: #fff;border-radius: 8px; padding: 10px; width: 100%;border: 1px solid rgba(0,0,0,0.25);display: flex;flex-direction: column;gap: 5px;">
		<h5 style="font-weight: 600; font-size: 14px; text-transform: uppercase;border-bottom: 1px solid rgba(0,0,0,0.25);padding-bottom: 5px;">Add new field</h5>
		<form id="addFieldForm">
			<label for="elementType" style="font-size: 13px;">Select Element Type:</label>
			<select style="font-weight: 400;width: 100%;padding: 5px;margin: 10px 0;font-size: 13px;" id="elementType">
				<option value="input">Input Field</option>
				<option value="ckeditor">CKEditor</option>
				<option value="button">Button/Link</option>
				<option value="array">Array</option>
				<option value="image-uploader">Image Uploader</option>
			</select>
			<div style="text-align: right;">
				<button type="button" class="button-main button-main-sm" onclick="openNameModal()">Add Field</button>
			</div>
		</form>
	</div>
</div>

<!-- Modal for inputting section name -->
<div id="sectionModal" class="modal">
	<div class="modal-content">
		<span class="close" onclick="closeSectionModal()">&times;</span>
		<div style="padding: 20px 0;">
			<label class="pb-2" for="elementName">Section Name:</label>
			<input style="width: 100%;display: block;" type="text" id="sectionName" required>
			<button class="mt-3 button-main button-main-md" onclick="addSection()">Add Section</button>
		</div>
	</div>
</div>

<!-- Modal for inputting element name -->
<div id="nameModal" class="modal">
	<div class="modal-content">
		<span class="close" onclick="closeNameModal()">&times;</span>
		<div style="padding: 20px 0;">
			<label class="pb-2" for="elementName">Field Title:</label>
			<input style="width: 100%;display: block;" type="text" id="elementName" required>
			<label for="elementAttrName" class="form-label" style="font-size: 13px;">Name Attribute:</label>
			<input  style="width: 100%;display: block;" id="elementAttrName" type="text" name="elementArrtName">
			<div id="image-uploader-wr" style="display: none;">
				<label for="elementAttrAltImg" class="form-label" style="font-size: 13px;">Image Alt Attribute:</label>
				<input  style="width: 100%;display: block;" id="elementAttrAltImg" type="text" name="elementAttrAltImg">
			</div>
			<button class="mt-3 button-main button-main-md" onclick="addElement()">Add Field</button>
		</div>
	</div>
</div>

<!-- Modal for adding button data -->
<div id="buttonModal" class="modal">
	<div class="modal-content">
		<span class="close" onclick="closeButtonModal()">&times;</span>
		<div style="padding: 20px 0;">
			<label class="pb-2" for="buttonTitle">Button Title:</label>
			<input style="width: 100%;display: block;" type="text" id="buttonTitle" required>
			<label for="buttonLink" class="form-label pb-2 mt-3" style="font-size: 13px;">Button Link:</label>
			<input style="width: 100%;display: block;" id="buttonLink" type="text" name="elementArrtName">
			<button class="mt-3 button-main button-main-md" onclick="addButtonData()">Add / Update</button>
		</div>
	</div>
</div>

<!-- Modal for adding button data -->
<div id="linkModal" class="modal">
	<div class="modal-content">
		<span class="close" onclick="closeLinkModal()">&times;</span>
		<div style="padding: 20px 0;">
			<label class="pb-2" for="linkTitle">Link Title:</label>
			<input style="width: 100%;display: block;" type="text" id="linkTitle" required>
			<label for="linkHref" class="form-label" style="font-size: 13px;">Link Href:</label>
			<input style="width: 100%;display: block;" id="linkHref" type="text" name="elementArrtName">
			<button class="mt-3 button-main button-main-md" onclick="addLinkData()">Add Field</button>
		</div>
	</div>
</div>

<!-- Modal for Adding Array Item -->
<div id="arrayItemModal" class="modal">
	<div class="modal-content" id="modal-input-container">
		<span class="close" onclick="closeArrayItemModal()">&times;</span>
		<!-- <form action="/api/v1/manage/add-post-array-item" method="POST" enctype="multipart/form-data"> -->
		<input type="hidden" id="arrayItemNamePointer" name="arrayItemNamePointer">
		<div id="item-modal-content" style="padding: 20px 0;font-size: 13px;">
			<label for="itemType" class="mb-3">Choose the item type</label>
			<select onchange="chooseItemType()" name="itemType" id="itemType"
				style="display: block;width: 100%;padding: 5px 10px; background-color: aliceblue;margin-bottom: 5px;">
				<option value="">Choose a type</option>
				<option value="String">String</option>
				<option value="Textarea">Textarea</option>
				<option value="Image">Image</option>
			</select>
			<button id="add-item-last-btn" class="mt-3 button-main button-main-md" onclick="addItem()">Add Item</button>
		</div>
		<!-- </form> -->
	</div>
</div>

<!-- Modal for editing textarea item content -->
<div id="jsonviewModal" class="modal">
	<div class="modal-content" id="modal-input-container">
		<span class="close" onclick="closeJsonViewModel()">&times;</span>
		<input type="hidden" id="arrayName" name="arrayName">
		<input type="hidden" id="itemId" name="itemId">
		<div id="item-modal-content" style="padding: 20px 0;font-size: 13px;">
			<label for="jsonContent" style="display: block;" class="mb-3">Choose the item type</label>
			<textarea id="jsonContent" style="width: 100%;height: 200px;" type="text"></textarea>
		</div>
		<button class="button-main button-main-md" onclick="updateItemTextContent()">Update JSON</button>
	</div>
</div>

<script src="https://unpkg.com/sortablejs@1.14.0/Sortable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
<script>
	const notyf = new Notyf({
		types: [
			{
				type: 'info',
				background: 'linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%)',
				icon: false,
				dismissible:true
			},
			{
				type: "error",
				background: "radial-gradient(371px at 2.9% 14.3%, rgb(255, 0, 102) 0%, rgb(80, 5, 35) 100.7%)",
				icon:false,
				dismissible:true
			}
		]
	});
	let buttonNamePointer;
	let buttonLinkPointer;
	let sectionNamePointer;
	let arrayItemNamePointer;
	window.addEventListener("DOMContentLoaded", ()=>{
		CKEDITOR.replace(document.getElementById("default-page-content"), {
			on: {
			instanceReady: function (evt) {
				// Store the textarea name along with the CKEditor instance
				evt.editor.textareaName = document.getElementById("default-page-content").getAttribute("name");
			}
			}
     	});
		CKEDITOR.replace(document.getElementById("jsonContent"), {
			on: {
			instanceReady: function (evt) {
				// Store the textarea name along with the CKEditor instance
				evt.editor.textareaName = 'itemValue';
			}
			}
     	});
		
		const sections = document.querySelectorAll('.section-wr');
		sections.forEach(section => {
			let textareas = section.querySelectorAll("textarea");
			textareas.forEach(textarea =>{
				CKEDITOR.replace(textarea, {
					on: {
					instanceReady: function (evt) {
						// Store the textarea name along with the CKEditor instance
						evt.editor.textareaName = textarea.getAttribute("name");
						evt.editor.sectionName = section.querySelector("input[name='section-name']").value;
					}
					}
				});
			})
		})

		new Sortable(document.querySelector('.sortable'), {
			animation: 150, // Customize the animation speed
			direction: 'vertical', // Allow vertical sorting only
			onEnd: function (evt) {
				const ejsPageName = document.getElementById("ejspageName").textContent;
				var newOrder = Array.from(evt.from.children).map(function (el) {
					const dataElem = el.querySelector("td:nth-child(3)")

					return dataElem.textContent.trim()
				});

				fetch("/api/v1/manage/order-page-section-array-item", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ ejsPageName, arrayItemNamePointer: evt.to.dataset.arrayname, sectionName:evt.to.dataset.sectionname, order: newOrder })
				})
				.then(res => res.json())
				.then(data => { window.location.reload(); })
			},
		});
	})

	function deleteArrayItem(sectionName, arrayName, itemId) {
		console.log("deleting array item");
		const ejsPageName = document.getElementById("ejspageName").textContent;
		fetch("/api/v1/manage/delete-page-array-item", {
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({ejsPageName, sectionName, arrayName, itemId})
		})
		.then(res => res.json())
		.then(data => data.success && window.location.reload());
	}

	function openEditorViewer(sectionName, arrayName, itemId, itemType, itemValue, index) {
		console.log("opening json viewer");
		sectionNamePointer = sectionName;
		document.getElementById("jsonviewModal").style.display = "block";
		const editor = CKEDITOR.instances['jsonContent'];
		editor.setData(\`\${itemValue?.replaceAll('"','')}\`);
		document.getElementById("itemId").value = itemId;
		document.getElementById("arrayName").value = arrayName;
	}

	function updateItemTextContent() {
		console.log("updating array item text content")
		const itemId = document.getElementById("itemId").value;
		const arrayName = document.getElementById("arrayName").value;
		const editor = CKEDITOR.instances['jsonContent'];
		const itemValue = editor.getData();
		const ejsPageName = document.getElementById("ejspageName").textContent;
		fetch("/api/v1/manage/update-page-item-textcontent", {
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({ejsPageName, sectionName:sectionNamePointer, arrayName, itemId, itemValue})
		})
		.then(res => res.json())
		.then(data => data?.success && window.location.reload());
	}

	function closeJsonViewModel() {
		document.getElementById("jsonviewModal").style.display = "none";
	}

	function addItem(){
		console.log("adding section array item");
		const ejsPageName = document.getElementById("ejspageName").textContent;
		const sectionName = document.getElementById("sectionName").value;
		const formData = new FormData();
		const container = document.querySelector("#modal-input-container");
		const selector = container.querySelector("#itemType");
		formData.append(selector.getAttribute("name"), selector.value);
		formData.append("ejsPageName", ejsPageName);
		formData.append("sectionName", sectionNamePointer);
		const allInputs = container.querySelectorAll("input:not([type='file'])");
		if (allInputs?.length > 0) {
			allInputs.forEach(input => {
				formData.append(input.getAttribute("name"), input.value);
			})
		}
		const textarea = CKEDITOR.instances['array-item-textarea'];
		
		if (textarea && textarea.textareaName === "itemValue") {
			formData.append(document.getElementById("array-item-textarea").getAttribute("name"), textarea.getData());
		}
		const allFileInputs = container.querySelectorAll("input[type='file']");
		if (allFileInputs?.length > 0) {
			allFileInputs.forEach(fileInput => {
				formData.append(fileInput.getAttribute("name"), fileInput.files[0])
			});
		}
		fetch("/api/v1/manage/add-page-section-array-item", {
			method: "POST",
			body: formData
		})
		.then(res => res.json())
		.then(data => window.location.reload())
	}

	function chooseItemType() {
			const select = document.getElementById("itemType");
			const clear = document.getElementById("new-item-container");
			if (clear) {
				const parentElement = clear.parentNode;
				parentElement.removeChild(clear);
			}
			if (select.value === "") {
				const parent = document.getElementById("item-modal-content");
				parent.removeChild(document.getElementById("new-item-container"));
				arrayItemNamePointer = "";
				document.getElementById("arrayItemNamePointer").value = arrayItemNamePointer;
				return;
			} else {
				if (select.value === "String") {
					const htmlText = \`
					<label class="mb-3" for="elementName">ITEM CONTENT:</label>
					<input name="itemValue" style="width: 100%;display: block;" type="text">\`;
					const elem = document.getElementById("add-item-last-btn");
					const newElement = document.createElement("div");
					newElement.id = 'new-item-container'
					newElement.innerHTML = htmlText;
					elem.parentNode.insertBefore(newElement, elem);
					document.getElementById("arrayItemNamePointer").value = arrayItemNamePointer;
				} else if (select.value === "Textarea") {
					const htmlText = \`
					<label class="mb-3" for="elementName">ITEM CONTENT:</label>
					<textarea id="array-item-textarea" style="width: 100%;display: block;" rows="8" cols="50"  name="itemValue" type="text"></textarea>\`;
					const elem = document.getElementById("add-item-last-btn");
					const newElement = document.createElement("div");
					newElement.id = 'new-item-container'
					newElement.innerHTML = htmlText;
					elem.parentNode.insertBefore(newElement, elem);
					document.getElementById("arrayItemNamePointer").value = arrayItemNamePointer;
					CKEDITOR.replace(document.getElementById("array-item-textarea"), {
						on: {
							instanceReady: function (evt) {
								// Store the textarea name along with the CKEditor instance
								evt.editor.textareaName = "itemValue";
								evt.editor.sectionName = sectionNamePointer;
							}
						}
					});
				} else if (select.value === "JSON") {
					const htmlText = \`
					<label class="mb-3" for="elementName">JSON DATA:</label>
					<textarea id="array-item-textarea" style="width: 100%;display: block;" rows="8" cols="50" type="text" name="itemValue"></textarea>\`;
					const elem = document.getElementById("add-item-last-btn");
					const newElement = document.createElement("div");
					newElement.id = 'new-item-container'
					newElement.innerHTML = htmlText;
					elem.parentNode.insertBefore(newElement, elem);
					document.getElementById("arrayItemNamePointer").value = arrayItemNamePointer;
				} else if (select.value === "Image") {
					const htmlText = \`
					<label class="mb-3" for="elementName">ITEM CONTENT:</label>
					<input name="itemValue" style="width: 100%;display: block;" type="file">\`;
					const elem = document.getElementById("add-item-last-btn");
					const newElement = document.createElement("div");
					newElement.id = 'new-item-container';
					newElement.innerHTML = htmlText;
					elem.parentNode.insertBefore(newElement, elem);
					document.getElementById("arrayItemNamePointer").value = arrayItemNamePointer;
				}
			}
		}

	function openItemModal(itemName, sectionName) {
		arrayItemNamePointer = itemName;
		sectionNamePointer = sectionName;
		document.getElementById("arrayItemModal").style.display = "block"
	}

	function closeArrayItemModal() {
		document.getElementById("arrayItemModal").style.display = "none"
	}

	function openNewSectionModal() {
		
		const modal = document.getElementById('sectionModal');
		modal.style.display = 'block';
	}

	function closeSectionModal() {
		
		const modal = document.getElementById('sectionModal');
		modal.style.display = 'none';
	}
	function openButtonModal(buttonTitle,elementArrtName, sectionName, buttonLink) {
		
		document.getElementById("buttonTitle").value = buttonTitle;
		document.getElementById("buttonLink").value = buttonLink;
		buttonNamePointer = elementArrtName;
		sectionNamePointer = sectionName;
		const modal = document.getElementById('buttonModal');
		modal.style.display = 'block';
	}

	function closeButtonModal() {
		
		const modal = document.getElementById('buttonModal');
		modal.style.display = 'none';
	}

	function openLinkModal(elementArrtName, sectionName) {
		
		buttonNamePointer = elementArrtName;
		sectionNamePointer = sectionName;
		const modal = document.getElementById('linkModal');
		modal.style.display = 'block';
	}

	function closeLinkModal() {
		
		const modal = document.getElementById('linkModal');
		modal.style.display = 'none';
	}

	function openNameModal() {
		
		let checkboxes = document.querySelectorAll(".section-choose-checkbox");
		let status = false;
		checkboxes.forEach(item => {
			if(item.checked) status = true
		});

		if(!status){
			return notyf.open({
				type:"info",
				message:"Please choose a section.",
			})
			// can do more stuff here
		}
		if(document.getElementById("elementType").value === "image-uploader"){
			document.getElementById("image-uploader-wr").style.display = "block"
		}  else {
			document.getElementById("image-uploader-wr").style.display = "none"
		}
		const modal = document.getElementById('nameModal');
		modal.style.display = 'block';
	}

	function closeNameModal() {
		
		const modal = document.getElementById('nameModal');
		modal.style.display = 'none';
	}

	function addSection() {
		
		const ejsPageName = document.getElementById("ejspageName").textContent;
		const sectionName = document.getElementById("sectionName").value;
		fetch("/api/v1/manage/add-section", {
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({ejsPageName, sectionName})
		}).then(res => res.json()).then(data => {
			if(data.success){
				window.location.reload();
			} else {
				notyf.open({
					type:"info",
					message:data.message
				})
			}
		})

		closeSectionModal();
	}

	function addButtonData() {
		
		const ejsPageName = document.getElementById("ejspageName").textContent;
		const sectionName = document.getElementById("sectionName").value;
		const buttonTitle = document.getElementById("buttonTitle").value;
		const buttonLink = document.getElementById("buttonLink").value;
		fetch("/api/v1/manage/save-page-data/add-button", {
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({ejsPageName, sectionNamePointer, buttonNamePointer, buttonTitle, buttonLink})
		}).then(res => res.json())
		.then((data)=>{
			closeButtonModal();
			window.location.reload();
		})

	}

	function addLinkData() {
		
		const ejsPageName = document.getElementById("ejspageName").textContent;
		const sectionName = document.getElementById("sectionName").value;
		const linkTitle = document.getElementById("linkTitle").value;
		const linkHref = document.getElementById("linkHref").value;
		fetch("/api/v1/manage/save-page-data/add-link", {
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({ejsPageName, sectionNamePointer, buttonNamePointer, linkTitle, linkHref})
		}).then(res => res.json())
		.then((data)=>{
			closeLinkModal();
			window.location.reload();
		})
	}

	function hanldeRemoveSection(sectionName) {
		
		const ejsPageName = document.getElementById("ejspageName").textContent;
		Swal.fire({
			title: 'Do you want to remove this section?',
			showDenyButton: true,
			showCancelButton: false,
			confirmButtonText: 'Remove Section',
			denyButtonText: 'Cancel',
			customClass: {
				actions: 'my-actions',
				cancelButton: 'order-1 right-gap',
				confirmButton: 'order-2',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				fetch("/api/v1/manage/remove-page-section", {
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify({ejsPageName,sectionName, elementAttrName})
				}).then(()=>{
					window.location.reload();
				})
			} else if (result.isDenied) {
				Swal.fire('Changes are not saved', '', 'info')
			}
		})
	}

	function handleElementDelete(sectionName, elementAttrName) {
		
		const ejsPageName = document.getElementById("ejspageName").textContent;
		Swal.fire({
			title: 'Do you want to delete this element?',
			showDenyButton: true,
			showCancelButton: false,
			confirmButtonText: 'Delete Element',
			denyButtonText: 'Cancel',
			customClass: {
				actions: 'my-actions',
				cancelButton: 'order-1 right-gap',
				confirmButton: 'order-2',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				fetch("/api/v1/manage/remove-section-element", {
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify({ejsPageName,sectionName, elementAttrName})
				}).then(()=>{
					window.location.reload();
				})
			} else if (result.isDenied) {
				Swal.fire('Changes are not saved', '', 'info')
			}
		})
	}

	function addElement() {
		
		const ejsPageName = document.getElementById("ejspageName").textContent;
		const elementType = document.getElementById('elementType').value;
		const elementName = document.getElementById('elementName').value;
		const elementAttrName = document.getElementById("elementAttrName").value;
		const checked = document.querySelectorAll(".section-choose-checkbox");
		let elementObject = undefined;
		let sectionName = undefined;
		checked.forEach(checkItem => {
			if(checkItem.checked){
				var parentDiv = checkItem.parentNode.parentNode.parentNode;
				sectionName = parentDiv.querySelector("div h5").textContent;
				//check for duplicates
				// if(data.success){
					const inputFieldsContainer = parentDiv.querySelector('.inputFieldsContainer');
					if (elementType === 'input') {
						elementObject = {
							elementName:"input",
							elementClass:"form-control",
							elementLabelName:elementName,
							elementAttrName:elementAttrName,
							elementAttrId:"",
							elementAttrType:"text",
							elementAttrFor:"",
							elementValue:"",
						}
					} else if (elementType === 'array') {
						
						elementObject = {
							elementName:"array",
							elementClass:"",
							elementLabelName:elementName,
							elementAttrName:elementAttrName,
							elementAttrId:"",
							elementAttrType:"array",
							elementAttrFor:"",
							elementValue:"",
							elementItems:[],
						}
					} else if (elementType === 'ckeditor') {
						elementObject = {
							elementName:"textarea",
							elementLabelName:elementName,
							elementAttrName:elementAttrName,
							elementAttrId:sectionName.toLowerCase()?.split(" ").join("")+new Date().getTime()+elementAttrName+"-editor-gen",
							elementAttrType:"text",
							elementAttrFor:sectionName.toLowerCase()?.split(" ").join("")+new Date().getTime()+elementAttrName+"-editor-gen",
							elementValue:"",
							elementAttrIsEditor:true
						}
					} else if (elementType === 'button') {
						elementObject = {
							elementName:"input-button",
							elementClass:"form-control",
							elementLabelName:elementName,
							elementAttrName:elementAttrName,
							elementAttrHref:"",
							elementAttrId:"",
							elementAttrType:"text",
							elementAttrFor:"",
							elementValue:"",
						}
					} else if (elementType === 'link') {
						elementObject = {
							elementName:"input-link",
							elementClass:"form-control",
							elementLabelName:elementName,
							elementAttrName:elementAttrName,
							elementAttrHref:"",
							elementAttrId:"",
							elementAttrType:"text",
							elementAttrFor:"",
							elementValue:"",
						}
					} else if (elementType === 'image-uploader') {
						elementObject = {
							elementName:"input",
							elementClass:"form-control",
							elementLabelName:elementName,
							elementAttrName:elementAttrName,
							elementAttrId:"",
							elementAttrType:"file",
							elementAttrFor:"",
							elementValue:"",
						}
					}
					if(elementObject && sectionName){
						
						fetch("/api/v1/manage/add-element", {
							method:"POST",
							headers:{
								"Content-Type":"application/json"
							},
							body: JSON.stringify({ejsPageName, sectionName, elementData:elementObject})
						}).then(res => res.json()).then(data => {
							window.location.reload();
						})
					}
				// } else {
				// 	notyf.open({
				// 		type:"info",
				// 		message:data.message
				// 	})
				// }
			}
			
		})
		closeNameModal();
	}

	function addInputField() {
		openNameModal();
	}

	async function submitFields() {
		
		const ejsPageName = document.getElementById("ejspageName").textContent;
		const pageDefaultTitle = document.getElementById("default-page-title").value;
		const pageDefaultContent = CKEDITOR.instances["default-page-content"].getData();
		const data = { ejsPageName, pageDefaultTitle, pageDefaultContent, sections: []};
		const formData = new FormData();
		formData.append("ejsPageName", ejsPageName);
		formData.append("pageDefaultTitle", pageDefaultTitle);
		formData.append("pageDefaultContent", pageDefaultContent);
		const sections = document.querySelectorAll('.section-wr');
		sections.forEach(section => {
			let sectionContent = [];
			let sectionNameInput = section.querySelector('input[name="section-name"]');
			const allInputs = section.querySelectorAll('input:not([name="section-name"]):not([type="file"]):not(.link-input)');
			allInputs.forEach(inputItem => {
				sectionContent.push({
					elementName:"input",
					elementAttrName:inputItem.getAttribute('name'),
					elementValue:inputItem.value,
				})
			})
			
			for (var instanceName in CKEDITOR.instances) {
				if (CKEDITOR.instances.hasOwnProperty(instanceName)) {
					var editor = CKEDITOR.instances[instanceName];
					var editorContent = editor.getData();
					console.log(editor.sectionName, sectionNameInput.value);
					if(editor.sectionName === sectionNameInput.value){
						sectionContent.push({
							elementName:"textarea",
							elementAttrName:editor.textareaName,
							elementValue:editorContent,
						})
					}
				}
			}

			const allFiles = section.querySelectorAll('input[type="file"]');
			allFiles.forEach(fileInput => {
				if (fileInput.files.length > 0) {
					formData.append('files', fileInput.files[0]);
					sectionContent.push({
						elementName:"input",
						elementAttrName:fileInput.getAttribute('name'),
						elementAttrSrcImg:fileInput.files[0].name,
						elementAttrAltImg:"Conative IT Solutions"
					})
				}
			})
			const allLinks = section.querySelectorAll(".link-input");
			allLinks.forEach(link => {
				sectionContent.push({
					elementName:"input-link",
					elementAttrName:link.getAttribute('name'),
					elementValue:link.value,
				})
			})
			// for text area also
			data.sections.push({
				sectionName: sectionNameInput.value,
				sectionContent
			})
		})
		formData.append("sections", JSON.stringify(data.sections))
		fetch("/api/v1/manage/save-page-data", {
			method:"POST",
			body:formData
		})
		.then(()=>{ window.location.reload() }).catch(err => console.log(err))
		console.log(data);
	}

	function handlePageStatus(element) {
		console.log(element.value);
		const ejsPageName = document.getElementById('ejspageName').textContent;
		fetch("/api/v1/manage/update-page-status", {
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({ejsPageName, status:element.value})
		})
		.then(res => res.json())
		.then(data => {})
	}

	function handlePageVisibility(element) {
		console.log(element.value);
		const ejsPageName = document.getElementById('ejspageName').textContent;
		fetch("/api/v1/manage/update-page-status", {
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({ejsPageName, visibility:element.value})
		})
		.then(res => res.json())
		.then(data => {})
	}
</script>
`

exports.newPageSection = (sectionTitle) => `<div  style="border-bottom: 1px solid rgba(0,0,0,0.25);width: 100%;padding: 15px;">
<div style="width: 80%;">
	<div>
		<h5>${sectionTitle}</h5>
	</div>
	<div id="${sectionTitle.toLowerCase()}-container">
		
	</div>
</div>
</div>`



exports.indianStatesAndCities = [
	{
	  state: "Andhra Pradesh",
	  cities: ["Visakhapatnam", "Vijayawada", "Hyderabad", "Guntur", "Tirupati"]
	},
	{
	  state: "Arunachal Pradesh",
	  cities: ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Ziro"]
	},
	{
	  state: "Assam",
	  cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"]
	},
	{
	  state: "Bihar",
	  cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"]
	},
	{
	  state: "Chhattisgarh",
	  cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Raigarh"]
	},
	{
	  state: "Goa",
	  cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"]
	},
	{
	  state: "Gujarat",
	  cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"]
	},
	{
	  state: "Haryana",
	  cities: ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar"]
	},
	{
	  state: "Himachal Pradesh",
	  cities: ["Shimla", "Mandi", "Solan", "Dharamshala", "Palampur"]
	},
	{
	  state: "Jharkhand",
	  cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"]
	},
	{
	  state: "Karnataka",
	  cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"]
	},
	{
	  state: "Kerala",
	  cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"]
	},
	{
	  state: "Madhya Pradesh",
	  cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"]
	},
	{
	  state: "Maharashtra",
	  cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"]
	},
	{
	  state: "Manipur",
	  cities: ["Imphal", "Thoubal", "Churachandpur", "Ukhrul", "Kakching"]
	},
	{
	  state: "Meghalaya",
	  cities: ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar"]
	},
	{
	  state: "Mizoram",
	  cities: ["Aizawl", "Lunglei", "Saiha", "Champhai", "Serchhip"]
	},
	{
	  state: "Nagaland",
	  cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"]
	},
	{
	  state: "Odisha",
	  cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur"]
	},
	{
	  state: "Punjab",
	  cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"]
	},
	{
	  state: "Rajasthan",
	  cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"]
	},
	{
	  state: "Sikkim",
	  cities: ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Singtam"]
	},
	{
	  state: "Tamil Nadu",
	  cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
	},
	{
	  state: "Telangana",
	  cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam"]
	},
	{
	  state: "Tripura",
	  cities: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"]
	},
	{
	  state: "Uttar Pradesh",
	  cities: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"]
	},
	{
	  state: "Uttarakhand",
	  cities: ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Mussoorie"]
	},
	{
	  state: "West Bengal",
	  cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"]
	}
  ];


	const temp = `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-weight:normal;margin:0px auto;max-width:650px;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
	<tbody>
		 <tr>
			<td style="border-collapse:collapse">
			 <span>
				<table style="border-collapse:collapse;font-family:Roboto,arial;font-weight:normal;margin:0px auto;max-width:600px;width:100%" width="100%" cellspacing="0" cellpadding="0" align="center">
					 <tbody>
						<tr>
						 <td style="border-collapse:collapse;font-size:0px;padding:32px 5px 28px;text-align:center" align="center">
							<div style="display:inline-block;float:left;max-width:290px;vertical-align:top;width:100%">
								 <table style="border-collapse:collapse;font-family:Roboto,arial;font-weight:normal" width="100%" cellspacing="0" cellpadding="0">
									<tbody>
									 <tr>
										<td style="border-collapse:collapse;font-size:15px;padding:2px 0px 0px">
											 <table style="border-collapse:collapse;font-family:roboto,arial;font-weight:500;width:100%" border="0" width="100%" cellspacing="0" cellpadding="0">
												<tbody>
												 <tr>
													<td style="border-collapse:collapse;text-align:left;padding-left: 35px;">
														<img style="height:auto;outline:none;text-decoration:none" src="batterybackend.react.stagingwebsite.co.in/images/indoreBatteryLogo.png" alt="logo " width="30" height="auto" class="CToWUd" data-bit="iit">
													</td>
												 </tr>
												 <tr>
													 <td style="text-align: left;">
													 <span style="border-collapse:collapse;color:rgb(144,164,174);font-family:Roboto,arial;font-size:15px;font-weight:bold;line-height:16px;text-align:right" align="right" width="100%">
														 <a style="color:rgb(0,0,0);font-family:Roboto,arial;font-size:18px;font-weight:700;line-height:16px;text-decoration:none" href="" rel="noopener" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://emailssignature.com&amp;source=gmail&amp;ust=1700029623404000&amp;usg=AOvVaw3GmZFuNorLZ1Vr1ikcRs9u">Indore Battery</a></span>
													 </td>
												 </tr>
												</tbody>
											 </table>
										</td>
									 </tr>
									</tbody>
								 </table>
							</div>
						 </td>
						</tr>
					 </tbody>
				</table>
			 </span>
			 
			</td>
		 </tr>
		 <tr style="1px solid red">
			 <td>
				 <span style="display:block;font-size: 24px;font-weight: 500;text-align: center;padding: 20px 0;">Thank You for shopping with Indore Battery</span>
				 <span style="display:block;text-align:center;font-size: 14px;font-weight: 600;color: #00000082;">You'll find your order summary below. If you have any questions regarding your order, please contact us at IndoreBatteryHelpline.in ext. 5</span>
			 </td>
		 </tr>
		 <tr>
			 <td style="padding:60px 0 0;">
				 <table>
					 <tr>
						 <td style="width:365px">
							 <table style="font-size: 14px;color: #0000009c;">
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Order Status</td>
									 <td style="padding-bottom: 10px;">PROCESSING</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Order no.</td>
									 <td style="padding-bottom: 10px;">WEB000542K00231</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 40px;">Shipping Date</td>
									 <td style="padding-bottom: 40px;">12/03/2024</td>
								 </tr>


								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Customer Code</td>
									 <td style="padding-bottom: 10px;">10CASH</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Date</td>
									 <td style="padding-bottom: 10px;">27/02/2024</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Created by</td>
									 <td style="padding-bottom: 10px;">Hrashikesh Pandey</td>
								 </tr>
							 </table>
						 </td>
						 <td style="width:465px">
							 <table style="font-size: 14px;color: #0000009c;">
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 40px;">Shipping Address</td>
									 <td style="padding-bottom: 40px;">69 C Bhaktavar Ram Nagar,Near Tilak Nagar, Indore M.P</td>
								 </tr>


								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Phone:</td>
									 <td style="padding-bottom: 10px;">9617308534</td>
								 </tr>
								 </table>
						 </td>
					 </tr>
				 </table>
			 </td>
		 </tr>
		 <tr>
			 <td>
				 <div style="background-color: #cccccc;padding: 7px 10px;margin: 20px 0;">
					 <span style="font-weight:600;font-size:14px;width: 45%;display:inline-block;">Customer Billing Details</span>
					 <span style="font-weight:600;font-size:14px;width: 45%;display:inline-block;">Delivery Details</span>
				 </div>
			 </td>
		 </tr>
		 <tr>
			 <td>
			 <table>
				 <tr>
				 <td style="width:365px;">
							 <table style="font-size: 14px;color: #0000009c;">
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">First Name</td>
									 <td style="padding-bottom: 10px;">Hrashikesh</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Order no.</td>
									 <td style="padding-bottom: 10px;">WEB000542K00231</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 40px;">Shipping Date</td>
									 <td style="padding-bottom: 40px;">12/03/2024</td>
								 </tr>


								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Customer Code</td>
									 <td style="padding-bottom: 10px;">10CASH</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Date</td>
									 <td style="padding-bottom: 10px;">27/02/2024</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Created by</td>
									 <td style="padding-bottom: 10px;">Hrashikesh Pandey</td>
								 </tr>
							 </table>
						 </td>		
						 <td style="width:365px;">
							 <table style="font-size: 14px;color: #0000009c;">
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Last Name</td>
									 <td style="padding-bottom: 10px;">Pandey</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Order no.</td>
									 <td style="padding-bottom: 10px;">WEB000542K00231</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 40px;">Shipping Date</td>
									 <td style="padding-bottom: 40px;">12/03/2024</td>
								 </tr>


								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Customer Code</td>
									 <td style="padding-bottom: 10px;">10CASH</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Date</td>
									 <td style="padding-bottom: 10px;">27/02/2024</td>
								 </tr>
								 <tr>
									 <td style="font-weight: 600;padding-right: 20px;padding-bottom: 10px;">Created by</td>
									 <td style="padding-bottom: 10px;">Hrashikesh Pandey</td>
								 </tr>
							 </table>
						 </td>
				 </tr>
			 
			 </table>
			 </td>
		 </tr>
		 <tr>
			 <td>
				 <div style="background-color: #cccccc;padding: 7px 10px;margin: 20px 0;">
					 <span style="font-weight:600;font-size:14px;width: 45%;display:inline-block;">Item Details</span>
					 <span style="font-weight:600;font-size:14px;width: 53%;display:inline-block;">
						 <span style="padding:0 15px">Item Qty</span>
						 <span style="padding:0 15px">Brand</span>
						 <span style="padding:0 15px">Unit Price</span>
						 <span style="padding:0 15px">Total</span>
					 </span>
				 </div>
			 </td>
		 </tr>
		 <tr>
			 <td>
				 <table style="font-size:14px;font-weight:400;padding: 10px 0;">
						 <tr>
							 <td style="width:305px">Amaron Flo 42b20r</td>
							 <td style="width:59px;text-align: center;">02</td>
							 <td style="width: 80px;text-align: center;padding: 0px 12px;">Amaron</td>
							 <td style="padding: 0 10px;width: 50px;text-align: center;">5,500</td>
							 <td style="width: 90px;text-align: center;">11,000</td>
						 </tr>		
				 </table>
			 </td>
			 </tr>
			 <tr>
				 <td style="padding-top: 30px;">
					 <table style="font-size: 14px;float: right;width: 270px;">
						 <tr>
							 <td style="font-weight: 600;padding-bottom:10px ;">SubTotal</td>
							 <td style="padding-bottom:10px ;">Rs 11000</td>
						 </tr>
						 <tr>
							 <td  style="font-weight: 600;padding-bottom:10px ;">Express Delivery</td>
							 <td style="padding-bottom:10px ;">Rs 400</td>
						 </tr>
						 <tr>
							 <td style="font-weight: 600;padding:5px 0;border-bottom: 2px solid rgba(0, 0, 0,0.4);border-top: 2px solid rgba(0, 0, 0,0.4);">Total</td>
							 <td style="border-bottom: 2px solid rgba(0, 0, 0,0.4);border-top: 2px solid rgba(0, 0, 0,0.4);">Rs 11400</td>
						 </tr>
					 </table>
				 </td>
			 </tr>

		 
	</tbody>
 </table>`